import { Box, Typography } from "@mui/material";
import * as d3 from "d3";
import { useContext, useMemo } from "react";
import {
  isInPrefectureId,
  prefectureIdToName,
} from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import { isNotNullOrUndefined } from "../../functions/nullOrUndefined";
import { BarChart } from "../common/BarChart";
import { HistoryBackground } from "../historyBackground/HistoryBackground";

export const Results = () => {
  const { peopleFlowData, selectedYear, selectedPrefecture, selectedType } =
    useContext(DataContext);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const selectedData = useMemo(
    () => peopleFlowData[selectedType],
    [peopleFlowData, selectedType]
  );
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
  return (
    <Box>
      <Typography variant="h5">Results</Typography>
      <Box>
        <Typography variant="subtitle1">時代背景</Typography>
        <HistoryBackground year={selectedYear} />
      </Box>
      <Box>
        <Typography variant="subtitle1">上位10件</Typography>
        <BarChart
          data={barChartData}
          width={500}
          height={400}
          maxValue={maxValue}
        />
      </Box>
    </Box>
  );
};
