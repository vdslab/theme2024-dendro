import { AppBar, Typography } from "@mui/material";

export const Header = () => {
  return (
    <AppBar position="static" sx={{ paddingX: 1, paddingY: 1 }}>
      <Typography variant="h4">たいとる</Typography>
    </AppBar>
  );
};
