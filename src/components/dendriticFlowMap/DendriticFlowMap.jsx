import React, { useContext, useMemo } from "react";
import { prefectureIntersection } from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import { calcWidth } from "../../features/dendriticFlowMap/calcWidth";
import { useDataFetch } from "../../hooks/useDataFetch";

export const DendriticFlowMap = ({
  flowData,
  projection,
  prefectureCenter,
}) => {
  const { data: dendriticMapData, isLoading } = useDataFetch(
    "data/dendriticFlowMapData.json"
  );

  const {
    selectedPrefecture,
    selectedDataType,
    peopleMaxValue,
    materialMaxValue,
  } = useContext(DataContext);

  const [startX, startY] = projection([
    prefectureCenter[selectedPrefecture].x,
    prefectureCenter[selectedPrefecture].y,
  ]);

  const maxValue = useMemo(
    () => (selectedDataType === "people" ? peopleMaxValue : materialMaxValue),
    [peopleMaxValue, materialMaxValue, selectedDataType]
  );

  const widths = useMemo(
    () =>
      !isLoading
        ? calcWidth(flowData, dendriticMapData, selectedPrefecture, maxValue)
        : 0,
    [flowData, maxValue, dendriticMapData, selectedPrefecture, isLoading]
  );

  const dendriticFlowMap = (id) => {
    try {
      const { prefectureChildren, nodeChildren } =
        dendriticMapData[selectedPrefecture][id];
      const { x: stX, y: stY } =
        id === 0 ? { x: startX, y: startY } : prefectureIntersection[id - 1];
      return (
        <React.Fragment key={`fragment-${id}`}>
          {prefectureChildren.map((childId) => {
            const [enX, enY] = projection([
              prefectureCenter[childId].x,
              prefectureCenter[childId].y,
            ]);
            const w = widths.prefecture[childId];
            console.log("pref", childId, w);
            return (
              <line
                key={childId}
                x1={stX}
                y1={stY}
                x2={enX}
                y2={enY}
                stroke="#ff0000"
                strokeWidth={w}
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          {nodeChildren.map((childId) => {
            const { x: enX, y: enY } = prefectureIntersection[childId - 1];
            const w = widths.node[childId];
            console.log("node", childId, w);
            return (
              <React.Fragment key={childId}>
                <line
                  key={childId}
                  x1={stX}
                  y1={stY}
                  x2={enX}
                  y2={enY}
                  stroke="#ff0000"
                  strokeWidth={w}
                />
                {dendriticFlowMap(childId)}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    } catch {
      return <></>;
    }
  };

  return (
    <g>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="4"
          markerHeight="3"
          refX="1"
          refY="1.5"
          orient="auto"
        >
          <polygon points="0 0.5, 2 1.5, 0 2.5" fill="#ff0000" />
        </marker>
      </defs>
      {dendriticFlowMap(0)}
    </g>
  );
};
