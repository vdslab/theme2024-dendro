import { useContext } from "react";
import {
  prefectureCenter,
  prefectureIdToName,
} from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import { calcWidth } from "../../features/flowMap/calcWidth";
import { isNullOrUndefined } from "../../functions/nullOrUndefined";
import { flowLineColor } from "../../styles/style";

export const FlowMap = ({ flowData, points, projection }) => {
  const { selectedPrefecture, selectedYear, maxValue } =
    useContext(DataContext);
  if (
    isNullOrUndefined(selectedPrefecture) ||
    isNullOrUndefined(flowData[selectedYear])
  ) {
    return null;
  }
  const data = flowData[selectedYear];
  const [startX, startY] = projection([
    points[selectedPrefecture].x,
    points[selectedPrefecture].y,
  ]);
  const widths = calcWidth(data, selectedPrefecture, maxValue);
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
      {Object.keys(prefectureIdToName).map((id) => {
        const center = prefectureCenter[id];
        const [cx, cy] = projection([center.x, center.y]);
        if (id === String(selectedPrefecture) || isNullOrUndefined(widths[id]))
          return null;
        return (
          <line
            key={id}
            x1={startX}
            y1={startY}
            x2={cx}
            y2={cy}
            stroke={flowLineColor}
            opacity={0.7}
            strokeWidth={widths[id].strokeWidth}
            markerEnd="url(#arrowhead)"
          />
        );
      })}
    </g>
  );
};
