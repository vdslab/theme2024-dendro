import { useMemo, useState } from "react";
import { isInPrefectureId } from "../../constants/prefecture";
import { isNotNullOrUndefined } from "../../functions/nullOrUndefined";
import { useMultiDataFetch } from "../../hooks/useMultiDataFetch";
import { DataContext } from "./DataContext";

export const DataContextProvider = ({ children }) => {
  const [selectedPrefecture, setSelectedPrefecture] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2000");

  const { data } = useMultiDataFetch(["data/flowOfPeople.json"], {
    revalidateOnFocus: false,
  });

  const flowOfPeople = data?.[0];
  const years = useMemo(
    () => (isNotNullOrUndefined(flowOfPeople) ? Object.keys(flowOfPeople) : []),
    [flowOfPeople]
  );
  const maxValue = useMemo(() => {
    if (!isNotNullOrUndefined(flowOfPeople)) return 0;

    const maxValues = Object.values(flowOfPeople).map((v1) => {
      return Math.max(
        ...Object.entries(v1).map(([key1, v2]) => {
          if (!isInPrefectureId(key1)) return 0;

          return Math.max(
            ...Object.entries(v2).map(([key2, v3]) =>
              isInPrefectureId(key2) && key1 !== key2 ? v3 : 0
            )
          );
        })
      );
    });

    return Math.max(...maxValues);
  }, [flowOfPeople]);

  const value = {
    flowOfPeople,
    years,
    maxValue,
    selectedPrefecture,
    setSelectedPrefecture,
    selectedYear,
    setSelectedYear,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
