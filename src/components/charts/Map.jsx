import { geoMercator, geoPath } from "d3";
import { useState } from "react";
import useSWR from "swr";
import { ZoomableSVG } from "../common";
import { BaseMap } from "./BaseMap";
import { SelectedPrefecture } from "./SelectedPrefecture";

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export const Map = () => {
  const { data } = useSWR("data/prefectures.geojson", fetcher, {
    revalidateOnFocus: false,
    suspense: true,
  });
  const [selectedPrefecture, setSelectedPrefecture] = useState(null);
  const width = 1000;
  const height = 800;

  const projection = geoMercator().fitExtent(
    [
      [0, 0],
      [width, height * 0.9],
    ],
    data
  );
  const pathGenerator = geoPath().projection(projection);

  return (
    <ZoomableSVG width={width} height={height}>
      <BaseMap
        features={data.features}
        pathGenerator={pathGenerator}
        setSelectedPrefecture={setSelectedPrefecture}
      />
      <SelectedPrefecture
        features={data.features}
        selectedPrefecture={selectedPrefecture}
        pathGenerator={pathGenerator}
        setSelectedPrefecture={setSelectedPrefecture}
      />
    </ZoomableSVG>
  );
};
