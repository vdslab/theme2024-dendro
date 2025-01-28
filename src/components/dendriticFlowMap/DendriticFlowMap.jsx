import React, { useContext } from "react";
import {
  prefectureIntersection,
  tokyoJujoMap,
} from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import { flowLineColor } from "../../styles/style";

export const DendriticFlowMap = ({ projection, prefectureCenter }) => {
  const { selectedPrefecture } = useContext(DataContext);

  const [startX, startY] = projection([
    prefectureCenter[selectedPrefecture].x,
    prefectureCenter[selectedPrefecture].y,
  ]);

  const dendriticFlowMap = (id) => {
    const { prefectureChildren, nodeChildren } = tokyoJujoMap[id];
    const { x: stX, y: stY } =
      id === 0 ? { x: startX, y: startY } : prefectureIntersection[id - 1];

    return (
      <React.Fragment key={`fragment-${id}`}>
        {prefectureChildren.map((childId) => {
          const [enX, enY] = projection([
            prefectureCenter[childId].x,
            prefectureCenter[childId].y,
          ]);
          return (
            <line
              key={childId}
              x1={stX}
              y1={stY}
              x2={enX}
              y2={enY}
              stroke={flowLineColor}
              markerEnd="url(#arrowhead)"
            />
          );
        })}
        {nodeChildren.map((childId) => {
          const { x: enX, y: enY } = prefectureIntersection[childId - 1];
          return (
            <React.Fragment key={childId}>
              <line
                key={childId}
                x1={stX}
                y1={stY}
                x2={enX}
                y2={enY}
                stroke={flowLineColor}
              />
              {dendriticFlowMap(childId)}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
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
          <polygon points="0 0.5, 2 1.5, 0 2.5" fill={flowLineColor} />
        </marker>
      </defs>
      {dendriticFlowMap(0)}
    </g>
  );
};
