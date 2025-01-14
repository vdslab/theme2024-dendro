import { Box } from "@mui/material";
import { Suspense } from "react";
import { Aside } from "./components/aside/Aside";
import { Map } from "./components/charts/Map";
import { Header, Loading } from "./components/common";
import { Provider } from "./provider/Provider";

export const App = () => {
  return (
    <Provider>
      <Box minHeight="100vh">
        <Header />
        <Suspense fallback={<Loading />}>
          <Box display="flex" height="100%">
            <Map />
            <Aside />
          </Box>
        </Suspense>
      </Box>
    </Provider>
  );
};
