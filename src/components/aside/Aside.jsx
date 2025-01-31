import { Box, Divider } from "@mui/material";
import { Description } from "../common/Description";
import { Results } from "./Results";
import { Settings } from "./Settings";

export const Aside = () => {
  return (
    <Box width="100%" marginX={2}>
      <Description />
      <Divider sx={{ marginY: 1 }} />
      <Settings />
      <Divider sx={{ marginY: 1 }} />
      <Results />
    </Box>
  );
};
