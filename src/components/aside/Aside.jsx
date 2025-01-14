import { Box } from "@mui/material";
import { Results } from "./Results";
import { Settings } from "./Settings";

export const Aside = () => {
  return (
    <Box width="100%" marginX={2}>
      <Settings />
      <Results />
    </Box>
  );
};
