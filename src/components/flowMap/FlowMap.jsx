import {
  prefectureCenter,
  prefectureIdToName,
} from "../../constants/prefecture";
import { calcWidth } from "../../features/flowMap/calcWidth";

export const FlowMap = ({ flowData, points, start, projection }) => {
  const [startX, startY] = projection([points[start].x, points[start].y]);
  const widths = calcWidth(flowData, start);
  return (
    <g>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="4"
          refX="5"
          refY="2"
          orient="auto"
        >
          <polygon points="0 0, 6 2, 0 4" fill="gray" />
        </marker>
      </defs>
      {Object.keys(prefectureIdToName).map((id) => {
        const center = prefectureCenter[id];
        const [cx, cy] = projection([center.x, center.y]);
        if (id === String(start) || widths[id] === undefined) {
          return null;
        }
        return (
          <line
            key={id}
            x1={startX}
            y1={startY}
            x2={cx}
            y2={cy}
            stroke="gray"
            strokeWidth={widths[id].strokeWidth}
            markerEnd="url(#arrowhead)"
          />
        );
      })}
    </g>
  );
};
