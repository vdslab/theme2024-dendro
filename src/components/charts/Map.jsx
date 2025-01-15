import { geoMercator, geoPath } from "d3";
import { useContext, useRef } from "react";
import { prefectureCenter } from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import { isNotNullOrUndefined } from "../../functions/nullOrUndefined";
import { useDataFetch } from "../../hooks/useDataFetch";
import { ZoomableSVG } from "../common";
import { FlowMap } from "../flowMap/FlowMap";
import { BaseMap } from "./BaseMap";
import { SelectedPrefecture } from "./SelectedPrefecture";

export const Map = () => {
  const { peopleFlowData, setSelectedPrefecture, selectedType } =
    useContext(DataContext);
  const ZoomableSVGRef = useRef(null);
  const { data: geojson } = useDataFetch("data/prefectures.geojson", {
    revalidateOnFocus: false,
    suspense: true,
  });

  const width = 900;
  const height = 840;

  const projection = geoMercator().fitExtent(
    [
      [-100, 0],
      [width + 100, height + 70],
    ],
    geojson
  );
  const pathGenerator = geoPath().projection(projection);
  const handleClick = (prefectureId) => {
    setSelectedPrefecture(prefectureId);
    const [x, y] = projection([
      prefectureCenter[prefectureId].x,
      prefectureCenter[prefectureId].y,
    ]);
    if (isNotNullOrUndefined(ZoomableSVGRef.current)) {
      ZoomableSVGRef.current.zoomTo(x, y, 3);
    }
  };

  return (
    <ZoomableSVG
      ref={ZoomableSVGRef}
      width={width}
      height={height}
      style={{ border: "1px solid lightgray" }}
    >
      <BaseMap
        features={geojson.features}
        pathGenerator={pathGenerator}
        handleClick={handleClick}
      />
      <SelectedPrefecture
        features={geojson.features}
        pathGenerator={pathGenerator}
      />
      <FlowMap
        flowData={peopleFlowData[selectedType]}
        points={prefectureCenter}
        projection={projection}
      />
    </ZoomableSVG>
  );
};
