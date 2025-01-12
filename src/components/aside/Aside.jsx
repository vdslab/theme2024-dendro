import { Box } from "@mui/material";
import { Results } from "./Results";
import { Settings } from "./Settings";

export const Aside = () => {
  return (
    <Box>
      <Settings />
      <Results />
    </Box>
  );
};
