import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import * as d3 from "d3";
import { useContext, useMemo, useState } from "react";
import { getDisplayName } from "../../constants/flowData";
import {
  isInPrefectureId,
  prefectureIdToName,
} from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import { isNotNullOrUndefined } from "../../functions/nullOrUndefined";
import { BarChart } from "../common/BarChart";
import { PieChart } from "../common/PieChart";
import { HistoryBackground } from "../historyBackground/HistoryBackground";

export const Results = () => {
  const {
    peopleFlowData,
    materialFlowData,
    selectedYear,
    selectedPrefecture,
    selectedType,
    selectedDataType,
  } = useContext(DataContext);

  const color = d3.scaleOrdinal(d3.schemePaired);
  const { selectedData, description, selectedFlowData } = useMemo(() => {
    const isPeople = selectedDataType === "people";
    return {
      selectedData: isPeople
        ? peopleFlowData[selectedType]
        : materialFlowData[selectedType],
      selectedFlowData: isPeople ? peopleFlowData : materialFlowData,
      description: isPeople
        ? "利用している移動機関の割合"
        : "利用している輸送機関の割合",
    };
  }, [peopleFlowData, materialFlowData, selectedDataType, selectedType]);
  const barChartData = useMemo(
    () =>
      isNotNullOrUndefined(selectedData) &&
      isNotNullOrUndefined(selectedPrefecture) &&
      isNotNullOrUndefined(selectedYear)
        ? Object.entries(selectedData[selectedYear][selectedPrefecture])
            .filter(
              ([key]) =>
                isInPrefectureId(key) && key !== String(selectedPrefecture)
            )
            .map(([key, value]) => {
              return {
                label: prefectureIdToName[key],
                value: Math.floor(value),
                color: color(key),
              };
            })
            .sort((a, b) => b.value - a.value)
        : [],
    [color, selectedData, selectedPrefecture, selectedYear]
  );

  const maxValue = useMemo(() => barChartData[0]?.value ?? 0, [barChartData]);
  const unit = useMemo(
    () => (selectedDataType === "people" ? "千人" : "トン"),
    [selectedDataType]
  );

  const pieChartData = useMemo(() => {
    if (
      isNotNullOrUndefined(selectedFlowData) &&
      isNotNullOrUndefined(selectedPrefecture) &&
      isNotNullOrUndefined(selectedYear)
    ) {
      const categories = Object.keys(selectedFlowData).filter(
        (category) =>
          !["Total", "total", "All"].some((exclude) =>
            category.includes(exclude)
          )
      );

      return categories
        .map((category, key) => {
          const value =
            selectedFlowData[category]?.[selectedYear]?.["48"]?.[
              selectedPrefecture
            ];

          return {
            label: getDisplayName(category, selectedDataType),
            value: Math.floor(value),
            color: color(key),
          };
        })
        .sort((a, b) => b.value - a.value);
    }
  }, [
    selectedYear,
    selectedPrefecture,
    color,
    selectedDataType,
    selectedFlowData,
  ]);

  const [chartType, setChartType] = useState("bar");

  return (
    <Box>
      <Typography variant="h5">結果</Typography>
      <Box>
        <Typography variant="subtitle1">時代背景</Typography>
        <HistoryBackground year={selectedYear} />
      </Box>
      <Box my={2}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(_, value) => {
            if (value) setChartType(value);
          }}
          aria-label="チャート表示切り替え"
        >
          <ToggleButton value="bar" aria-label="棒グラフ" size="small">
            バーチャート
          </ToggleButton>
          <ToggleButton value="pie" aria-label="円グラフ" size="small">
            パイチャート
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        {chartType === "bar" ? (
          <Box>
            <Typography variant="subtitle1">上位15県</Typography>
            <BarChart
              data={barChartData}
              width={540}
              height={400}
              maxValue={maxValue}
              unit={unit}
            />
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle1">{description}</Typography>
            <PieChart
              data={pieChartData}
              width={560}
              height={320}
              unit={unit}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
