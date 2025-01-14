import { geoMercator, geoPath } from "d3";
import { useState } from "react";
import { prefectureCenter } from "../../constants/prefecture";
import { isNotNullOrUndefined } from "../../functions/nullOrUndefined";
import { useDataFetch } from "../../hooks/useDataFetch";
import { ZoomableSVG } from "../common";
import { FlowMap } from "../flowMap/FlowMap";
import { BaseMap } from "./BaseMap";
import { SelectedPrefecture } from "./SelectedPrefecture";

export const Map = ({ flowData }) => {
  const { data: geojson } = useDataFetch("data/prefectures.geojson", {
    revalidateOnFocus: false,
    suspense: true,
  });

  const [selectedPrefecture, setSelectedPrefecture] = useState(null);
  const width = 900;
  const height = 840;

  const projection = geoMercator().fitExtent(
    [
      [0, 0],
      [width, height],
    ],
    geojson
  );
  const pathGenerator = geoPath().projection(projection);

  return (
    <ZoomableSVG
      width={width}
      height={height}
      style={{ border: "1px solid lightgray" }}
    >
      <BaseMap
        features={geojson.features}
        pathGenerator={pathGenerator}
        setSelectedPrefecture={setSelectedPrefecture}
      />
      <SelectedPrefecture
        features={geojson.features}
        selectedPrefecture={selectedPrefecture}
        pathGenerator={pathGenerator}
        setSelectedPrefecture={setSelectedPrefecture}
      />
      {isNotNullOrUndefined(selectedPrefecture) && (
        <FlowMap
          flowData={flowData[2000]}
          points={prefectureCenter}
          start={selectedPrefecture}
          projection={projection}
        />
      )}
    </ZoomableSVG>
  );
};
