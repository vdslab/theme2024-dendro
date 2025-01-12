import { AppBar, Typography } from "@mui/material";

export const Header = () => {
  return (
    <AppBar position="static" sx={{ paddingX: 1, paddingY: 0.5 }}>
      <Typography variant="h5">たいとる</Typography>
    </AppBar>
  );
};
