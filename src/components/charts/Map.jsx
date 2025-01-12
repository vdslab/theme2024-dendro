import { geoMercator, geoPath } from "d3";
import { useState } from "react";
import { ZoomableSVG } from "../common/ZoomableSVG";
import { BaseMap } from "./BaseMap";
import { SelectedPrefecture } from "./SelectedPrefecture";

export const Map = ({ data }) => {
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
    <ZoomableSVG
      width={width}
      height={height}
      style={{ border: "1px solid #ccc" }}
    >
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
