import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import * as d3 from "d3";
import { useContext, useMemo, useState } from "react";
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

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const { selectedData, description } = useMemo(() => {
    const isPeople = selectedDataType === "people";
    return {
      selectedData: isPeople
        ? peopleFlowData[selectedType]
        : materialFlowData[selectedType],
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

  const pieChartData = useMemo(() => {
    if (!selectedData || !selectedYear || !selectedPrefecture) return [];

    const data = selectedData[selectedYear]?.[selectedPrefecture];
    if (!data) return [];

    // 「全機関利用数」を除いた総利用数
    const total = Object.entries(data)
      .filter(([key]) => key !== "全機関利用数")
      .reduce((sum, [, value]) => sum + value, 0);

    if (total === 0) return [];

    return Object.entries(data)
      .filter(([key]) => key !== "全機関利用数")
      .map(([key, value]) => ({
        label: key,
        value: (value / total) * 100, // 割合に変換
        color: color(key),
      }))
      .sort((a, b) => b.value - a.value);
  }, [selectedData, selectedYear, selectedPrefecture, color]);

  const maxValue = useMemo(() => barChartData[0]?.value ?? 0, [barChartData]);
  const unit = useMemo(
    () => (selectedDataType === "people" ? "千人" : "トン"),
    [selectedDataType]
  );

  // チャートの表示状態を管理 (BarChart or PieChart)
  const [chartType, setChartType] = useState("bar"); // "bar" または "pie"

  return (
    <Box>
      <Typography variant="h5">Results</Typography>
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
          <ToggleButton value="bar" aria-label="棒グラフ">
            バーチャート
          </ToggleButton>
          <ToggleButton value="pie" aria-label="円グラフ">
            パイチャート
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        {chartType === "bar" ? (
          <BarChart
            data={barChartData}
            width={540}
            height={400}
            maxValue={maxValue}
            unit={unit}
          />
        ) : (
          <Box>
            <Typography variant="subtitle1">{description}</Typography>
            <PieChart data={barChartData} width={400} height={400} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
