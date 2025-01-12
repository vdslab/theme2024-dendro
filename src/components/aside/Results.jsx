import { Box } from "@mui/material";
import { PieChart } from "../common/PieChart";

export const Results = () => {
  const dummy = [
    {
      value: 10,
      label: "A",
      color: "#FF6384",
    },
    {
      value: 20,
      label: "B",
      color: "#36A2EB",
    },
    {
      value: 30,
      label: "C",
      color: "#FFCE56",
    },
    {
      value: 40,
      label: "D",
      color: "#4BC0C0",
    },
  ];
  return (
    <Box>
      <PieChart
        width={300}
        height={300}
        data={dummy.sort((a, b) => b.value - a.value)}
      />
    </Box>
  );
};
