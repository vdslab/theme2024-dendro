import { useMemo, useState } from "react";
import {
  peopleFlowDataBasePath,
  peopleFlowDataNameMap,
} from "../../constants/flowData";
import { isInPrefectureId } from "../../constants/prefecture";
import {
  isNotNullOrUndefined,
  isNullOrUndefined,
} from "../../functions/nullOrUndefined";
import { useMultiDataFetch } from "../../hooks/useMultiDataFetch";
import { DataContext } from "./DataContext";

export const DataContextProvider = ({ children }) => {
  const [selectedPrefecture, setSelectedPrefecture] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2000");
  const [selectedType, setSelectedType] = useState("total");

  const fetchUrls = Object.values(peopleFlowDataNameMap).map((data) => {
    return `${peopleFlowDataBasePath}/${data.fileName}.json`;
  });

  const { data } = useMultiDataFetch(fetchUrls, {
    revalidateOnFocus: false,
  });

  const peopleFlowData = useMemo(() => {
    if (isNullOrUndefined(data)) return [];

    return Object.values(peopleFlowDataNameMap).reduce((acc, cur, index) => {
      acc[cur.id] = data[index];
      return acc;
    }, {});
  }, [data]);

  const totalData = useMemo(
    () => (isNotNullOrUndefined(peopleFlowData) ? peopleFlowData.total : {}),
    [peopleFlowData]
  );

  const years = useMemo(
    () => (isNotNullOrUndefined(totalData) ? Object.keys(totalData) : []),
    [totalData]
  );
  const maxValue = useMemo(() => {
    if (!isNotNullOrUndefined(totalData)) return 0;

    const maxValues = Object.values(totalData).map((v1) => {
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
  }, [totalData]);

  const value = {
    peopleFlowData,
    years,
    maxValue,
    selectedPrefecture,
    setSelectedPrefecture,
    selectedYear,
    setSelectedYear,
    selectedType,
    setSelectedType,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
