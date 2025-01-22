import { useMemo, useState } from "react";
import {
  materialFlowDataBasePath,
  materialFlowDataNameMap,
  peopleFlowDataBasePath,
  peopleFlowDataNameMap,
} from "../../constants/flowData";
import {
  isInPrefectureId,
  prefectureNameToId,
} from "../../constants/prefecture";
import {
  isNotNullOrUndefined,
  isNullOrUndefined,
} from "../../functions/nullOrUndefined";
import { useMultiDataFetch } from "../../hooks/useMultiDataFetch";
import { DataContext } from "./DataContext";

export const DataContextProvider = ({ children }) => {
  const [selectedPrefecture, setSelectedPrefecture] = useState(
    prefectureNameToId["東京都"]
  );
  const [selectedYear, setSelectedYear] = useState("2000");
  const [selectedType, setSelectedType] = useState("total");
  const [selectedDataType, setSelectedDataType] = useState("people");

  // 人流データ関連
  const fetchPeopleUrls = Object.values(peopleFlowDataNameMap).map((data) => {
    return `${peopleFlowDataBasePath}/${data.fileName}.json`;
  });

  const { data: peopleData } = useMultiDataFetch(fetchPeopleUrls, {
    revalidateOnFocus: false,
  });

  const peopleFlowData = useMemo(() => {
    if (isNullOrUndefined(peopleData)) return [];

    return Object.values(peopleFlowDataNameMap).reduce((acc, cur, index) => {
      acc[cur.id] = peopleData[index];
      return acc;
    }, {});
  }, [peopleData]);

  const peopleTotalData = useMemo(
    () => (isNotNullOrUndefined(peopleFlowData) ? peopleFlowData.total : {}),
    [peopleFlowData]
  );

  const years = useMemo(
    () =>
      isNotNullOrUndefined(peopleTotalData) ? Object.keys(peopleTotalData) : [],
    [peopleTotalData]
  );

  const peopleMaxValue = useMemo(() => {
    if (!isNotNullOrUndefined(peopleTotalData)) return 0;

    const maxValues = Object.values(peopleTotalData).map((v1) => {
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
  }, [peopleTotalData]);

  // 物流データ関連
  const fetchMaterialUrls = Object.values(materialFlowDataNameMap).map(
    (data) => {
      return `${materialFlowDataBasePath}/${data.fileName}.json`;
    }
  );

  const { data: materialData } = useMultiDataFetch(fetchMaterialUrls, {
    revalidateOnFocus: false,
  });

  const materialFlowData = useMemo(() => {
    if (isNullOrUndefined(materialData)) return [];

    return Object.values(materialFlowDataNameMap).reduce((acc, cur, index) => {
      acc[cur.id] = materialData[index];
      return acc;
    }, {});
  }, [materialData]);

  const materialTotalData = useMemo(
    () =>
      isNotNullOrUndefined(materialFlowData) ? materialFlowData.totalAll : {},
    [materialFlowData]
  );

  const materialMaxValue = useMemo(() => {
    if (!isNotNullOrUndefined(materialTotalData)) return 0;

    const maxValues = Object.values(materialTotalData).map((v1) => {
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
  }, [materialTotalData]);

  const value = {
    years,
    // 人流データ関連
    peopleFlowData,
    peopleMaxValue,
    // 物流データ関連
    materialFlowData,
    materialMaxValue,
    // 設定関連
    selectedPrefecture,
    setSelectedPrefecture,
    selectedYear,
    setSelectedYear,
    selectedType,
    setSelectedType,
    selectedDataType,
    setSelectedDataType,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
