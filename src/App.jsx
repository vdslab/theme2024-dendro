import { useEffect, useState } from "react";
import { Map } from "./components/charts/Map";

export const App = () => {
  const [geojson, setGeojson] = useState(null);

  useEffect(() => {
    fetch("/data/prefectures.geojson")
      .then((response) => response.json())
      .then((data) => setGeojson(data));
  }, []);

  if (!geojson) {
    return <div>Loading...</div>;
  }

  return <Map data={geojson} />;
};
