import * as d3 from "d3";
import { useEffect, useMemo } from "react";
import { isNotNullOrUndefinedOrEmptyArray } from "../../functions/nullOrUndefined";

const labelWidth = 70;
const Scale = ({ xScale }) => {
  const xAxis = d3.axisBottom(xScale).ticks(3);

  useEffect(() => {
    const xAxisGroup = d3.select(".x-axis");
    xAxisGroup.call(xAxis);
  }, [xAxis]);

  return (
    <g
      className="x-axis"
      transform={`translate(${labelWidth}, 0)`}
      style={{
        msUserSelect: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    />
  );
};

export const BarChart = ({ data, maxValue, width, height, unit }) => {
  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([0, width - labelWidth]),
    [width, maxValue]
  );
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width + 50} ${height}`}>
      {isNotNullOrUndefinedOrEmptyArray(data) && (
        <>
          <Scale xScale={xScale} />
          <text x={width + 3} y={10} fontSize="12">
            {unit}
          </text>
          <g transform="translate(0, 30)">
            {data.slice(0, 15).map((item, index) => {
              const x = labelWidth;
              const y = index * 20;
              const textY = y + 10;
              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={y}
                    width={xScale(item.value)}
                    height="16"
                    fill={item.color}
                    style={{ transition: "width 1s" }}
                  />
                  <text
                    x={x - 10}
                    y={textY}
                    fill="#000"
                    fontSize="14"
                    textAnchor="end"
                    alignmentBaseline="middle"
                    style={{
                      msUserSelect: "none",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  >
                    {item.label}
                  </text>
                  <text
                    x={labelWidth + 10}
                    y={textY}
                    dominantBaseline="middle"
                    fill="#000"
                    fontSize="14"
                    style={{
                      msUserSelect: "none",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  >
                    {item.value.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </g>
        </>
      )}
    </svg>
  );
};
