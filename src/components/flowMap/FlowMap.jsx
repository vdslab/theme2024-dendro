import { useContext, useMemo } from "react";
import { prefectureIdToName } from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import { calcWidth } from "../../features/flowMap/calcWidth";
import { isNullOrUndefined } from "../../functions/nullOrUndefined";
import { flowLineColor } from "../../styles/style";

export const FlowMap = ({ flowData, projection, prefectureCenter }) => {
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
    () => calcWidth(flowData, selectedPrefecture, maxValue),
    [flowData, selectedPrefecture, maxValue]
  );

  if (isNullOrUndefined(widths)) {
    return null;
  }

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
