import { Box, Typography } from "@mui/material";
import { useDataFetch } from "../../hooks/useDataFetch";

export const HistoryBackground = ({ year }) => {
  const { data, isLoading } = useDataFetch("data/historyBackgroundData.json", {
    revalidateOnFocus: false,
  });

  return (
    <Box bgcolor="#eee" p={0.5} borderRadius={1}>
      <ul>
        {!isLoading &&
          data[year].map((item, i) => {
            return (
              <Typography key={i} variant="body2">
                <li>{item}</li>
              </Typography>
            );
          })}
      </ul>
    </Box>
  );
};
