import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { DataContextProvider } from "../context/DataContext/DataContextProvider";
import { theme } from "../styles/theme";

export const Provider = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataContextProvider>{children}</DataContextProvider>
    </ThemeProvider>
  );
};
