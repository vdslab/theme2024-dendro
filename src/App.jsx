import { Box } from "@mui/material";
import { Suspense } from "react";
import { Map } from "./components/charts/Map";
import { Header, Loading } from "./components/common";
import { Provider } from "./provider/Provider";

export const App = () => (
  <Provider>
    <Box height="100vh">
      <Header />
      <Suspense fallback={<Loading />}>
        <Map />
      </Suspense>
    </Box>
  </Provider>
);
