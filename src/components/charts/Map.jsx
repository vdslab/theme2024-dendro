import { geoMercator, geoPath } from "d3";
import { useContext, useEffect, useMemo, useRef } from "react";
import { DataContext } from "../../context/DataContext/DataContext";
import { calcPrefectureCenter } from "../../features/map/calcPrefectureCenter";
import {
  isNotNullOrUndefined,
  isNullOrUndefined,
} from "../../functions/nullOrUndefined";
import { useDataFetch } from "../../hooks/useDataFetch";
import { ZoomableSVG } from "../common";
import { FlowMap } from "../flowMap/FlowMap";
import { BaseMap } from "./BaseMap";
import { SelectedPrefecture } from "./SelectedPrefecture";

export const Map = () => {
  const {
    peopleFlowData,
    materialFlowData,
    selectedPrefecture,
    setSelectedPrefecture,
    selectedYear,
    selectedType,
    selectedDataType,
  } = useContext(DataContext);
  const ZoomableSVGRef = useRef(null);
  const { data: geojson } = useDataFetch("data/prefectures.geojson", {
    revalidateOnFocus: false,
    suspense: true,
  });

  const prefectureCenter = useMemo(
    () =>
      isNotNullOrUndefined(geojson) ? calcPrefectureCenter(geojson) : null,
    [geojson]
  );

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
  };

  useEffect(() => {
    if (isNullOrUndefined(selectedPrefecture)) {
      return;
    }
    const [x, y] = projection([
      prefectureCenter[selectedPrefecture].x,
      prefectureCenter[selectedPrefecture].y,
    ]);
    if (isNotNullOrUndefined(ZoomableSVGRef.current)) {
      ZoomableSVGRef.current.zoomTo(x, y, 3);
    }
  }, [prefectureCenter, projection, selectedPrefecture]);

  const selectedPrefectureSvg = useMemo(() => {
    if (isNullOrUndefined(geojson)) return null;
    const feature = geojson.features.find(
      (feature) => feature.properties.pref === selectedPrefecture
    );
    return (
      <SelectedPrefecture feature={feature} pathGenerator={pathGenerator} />
    );
  }, [geojson, pathGenerator, selectedPrefecture]);

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
      {selectedPrefectureSvg}
      {isNotNullOrUndefined(selectedPrefecture) &&
        (selectedDataType === "people"
          ? isNotNullOrUndefined(peopleFlowData[selectedType]) &&
            isNotNullOrUndefined(
              peopleFlowData[selectedType][selectedYear]
            ) && (
              <FlowMap
                flowData={peopleFlowData[selectedType][selectedYear]}
                projection={projection}
                prefectureCenter={prefectureCenter}
              />
            )
          : isNotNullOrUndefined(materialFlowData[selectedType]) &&
            isNotNullOrUndefined(
              materialFlowData[selectedType][selectedYear]
            ) && (
              <FlowMap
                flowData={materialFlowData[selectedType][selectedYear]}
                projection={projection}
                prefectureCenter={prefectureCenter}
              />
            ))}
    </ZoomableSVG>
  );
};
