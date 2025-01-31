import { useRef, useState } from "react";

export const PieChart = ({ data, width, height, threshold = 0.05, unit }) => {
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });
  const svgRef = useRef(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeValue = 0;
  const processedData = [];
  let otherValue = 0;

  data.forEach((item) => {
    if (item.value / total < threshold) {
      otherValue += item.value;
    } else {
      processedData.push(item);
    }
  });

  if (otherValue > 0) {
    processedData.push({
      value: otherValue,
      label: "その他",
      color: "#d3d3d3",
    });
  }

  const legendWidth = 150;
  const chartSize = Math.min(width - legendWidth - 140, height);
  const radius = chartSize / 2;
  const centerX = radius;
  const centerY = height / 2;
  const legendX = chartSize + 50;
  const legendY = 20;

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {processedData.map((item, index) => {
          const startAngle =
            (cumulativeValue / total) * 2 * Math.PI - Math.PI / 2;
          cumulativeValue += item.value;
          const endAngle =
            (cumulativeValue / total) * 2 * Math.PI - Math.PI / 2;

          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);

          const largeArcFlag = item.value > total / 2 ? 1 : 0;

          return (
            <g
              key={index}
              onMouseEnter={(e) => {
                if (svgRef.current) {
                  const rect = svgRef.current.getBoundingClientRect();
                  const tooltipX = e.clientX - rect.left + 10; // SVG内の相対座標
                  const tooltipY = e.clientY - rect.top + 10; // SVG内の相対座標
                  setHoveredLabel(item.label);
                  setTooltip({
                    visible: true,
                    x: tooltipX,
                    y: tooltipY,
                    text: `${
                      item.label
                    }: ${item.value.toLocaleString()} (${unit})`,
                  });
                }
              }}
              onMouseMove={(e) => {
                if (svgRef.current) {
                  const rect = svgRef.current.getBoundingClientRect();
                  const tooltipX = Math.min(
                    e.clientX - rect.left + 10,
                    width - 100
                  );
                  const tooltipY = Math.min(
                    e.clientY - rect.top + 10,
                    height - 40
                  );
                  setTooltip((prev) => ({ ...prev, x: tooltipX, y: tooltipY }));
                }
              }}
              onMouseLeave={() => {
                setHoveredLabel(null);
                setTooltip({ visible: false, x: 0, y: 0, text: "" });
              }}
              style={{ cursor: "pointer" }}
            >
              <path
                d={`M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                fill={item.color}
                fillOpacity={
                  hoveredLabel && hoveredLabel !== item.label ? 0.3 : 1
                }
              />
            </g>
          );
        })}

        {/* 凡例 */}
        {processedData.map((item, index) => (
          <g
            key={`legend-${index}`}
            transform={`translate(${legendX}, ${legendY + index * 20})`}
            onMouseEnter={() => setHoveredLabel(item.label)}
            onMouseLeave={() => setHoveredLabel(null)}
            style={{ cursor: "pointer" }}
          >
            <rect width="14" height="14" fill={item.color} />
            <text x="20" y="12" fontSize="14" fill="#000">
              {item.label}
            </text>
          </g>
        ))}
      </svg>

      {/* ツールチップ */}
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            background: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "5px",
            fontSize: "14px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            transform: "translate(0, 0)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};
