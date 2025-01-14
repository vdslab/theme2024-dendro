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

export const Results = () => {
  const { flowOfPeople, selectedYear, selectedPrefecture, maxValue } =
    useContext(DataContext);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const barChartData = useMemo(
    () =>
      isNotNullOrUndefined(flowOfPeople) &&
      isNotNullOrUndefined(selectedPrefecture) &&
      isNotNullOrUndefined(selectedYear)
        ? Object.entries(flowOfPeople[selectedYear][selectedPrefecture])
            .filter(
              ([key]) =>
                isInPrefectureId(key) && key !== String(selectedPrefecture)
            )
            .map(([key, value]) => {
              return {
                label: prefectureIdToName[key],
                value,
                color: color(key),
              };
            })
            .sort((a, b) => b.value - a.value)
        : [],
    [color, flowOfPeople, selectedPrefecture, selectedYear]
  );
  return (
    <Box>
      <Typography variant="h5">Results</Typography>
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
