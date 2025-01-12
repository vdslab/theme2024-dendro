import { geoMercator, geoPath } from "d3";
import { useState } from "react";
import useSWR from "swr";
import { prefectureCenter } from "../../constants/prefecture";
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
  const width = 900;
  const height = 840;

  const projection = geoMercator().fitExtent(
    [
      [0, 0],
      [width, height],
    ],
    data
  );
  const pathGenerator = geoPath().projection(projection);

  return (
    <ZoomableSVG
      width={width}
      height={height}
      style={{ border: "1px solid lightgray" }}
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
      {Object.entries(prefectureCenter).map(([key, center]) => {
        const [cx, cy] = projection([center.x, center.y]);
        return <circle key={key} cx={cx} cy={cy} r={2} fill="red" />;
      })}
    </ZoomableSVG>
  );
};
