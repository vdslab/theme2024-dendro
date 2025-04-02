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
import { DendriticFlowMap } from "../dendriticFlowMap/DendriticFlowMap";
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
    // 単一選択
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

      {/* 単一フロー表示 */}
      {isNotNullOrUndefined(selectedPrefecture) &&
        (selectedDataType === "people"
          ? isNotNullOrUndefined(peopleFlowData[selectedType]) &&
            isNotNullOrUndefined(
              peopleFlowData[selectedType][selectedYear]
            ) && (
              <DendriticFlowMap
                flowData={
                  peopleFlowData[selectedType][selectedYear][selectedPrefecture]
                }
                projection={projection}
                prefectureCenter={prefectureCenter}
                geojson={geojson}
              />
            )
          : isNotNullOrUndefined(materialFlowData[selectedType]) &&
            isNotNullOrUndefined(
              materialFlowData[selectedType][selectedYear]
            ) && (
              <DendriticFlowMap
                flowData={
                  materialFlowData[selectedType][selectedYear][
                    selectedPrefecture
                  ]
                }
                projection={projection}
                prefectureCenter={prefectureCenter}
                geojson={geojson}
              />
            ))}

      {/* 機能説明 */}
      <g transform="translate(20, 780)">
        <rect
          x="0"
          y="0"
          width="860"
          height="50"
          rx="5"
          ry="5"
          fill="#f8f9fa"
          stroke="#dee2e6"
          strokeWidth="1"
        />
        <text
          x="10"
          y="20"
          fill="#212529"
          fontSize="14"
          fontFamily="sans-serif"
        >
          【機能説明】
        </text>
        <text
          x="10"
          y="40"
          fill="#212529"
          fontSize="12"
          fontFamily="sans-serif"
        >
          ・ウェイポイント機能：フローの経路を制御するための中間点を設定可能
        </text>
      </g>
    </ZoomableSVG>
  );
};
