import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const Settings = () => {
  const [direction, setDirection] = useState("in");
  const [flow, setFlow] = useState("material");
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h5">Settings</Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">方向：</Typography>
        <ToggleButtonGroup
          value={direction}
          onChange={(_, value) => setDirection(value)}
          exclusive
          sx={{ marginLeft: 1 }}
        >
          <ToggleButton size="small" value="in">
            入る
          </ToggleButton>
          <ToggleButton size="small" value="out">
            出る
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">種類：</Typography>
        <ToggleButtonGroup
          value={flow}
          onChange={(_, value) => setFlow(value)}
          exclusive
          sx={{ marginLeft: 1 }}
        >
          <ToggleButton size="small" value="material">
            物流
          </ToggleButton>
          <ToggleButton size="small" value="people">
            人流
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
