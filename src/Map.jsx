import { useState } from "react";
import { geoPath, geoMercator } from "d3-geo";

export const Map = ({ data }) => {
  const [hoveredPrefecture, setHoveredPrefecture] = useState(null);

  const projection = geoMercator().fitSize([1000, 800], data);
  const pathGenerator = geoPath().projection(projection);
  return (
    <svg width={1000} height={800} style={{ border: "1px solid #ccc" }}>
      {data.features.map((feature, index) => {
        const prefectureName = feature.properties.name;

        return (
          <path
            key={index}
            d={pathGenerator(feature)}
            fill="#cccccc"
            stroke="#000"
            strokeWidth={hoveredPrefecture === prefectureName ? 2 : 1}
            onMouseEnter={() => {
              setHoveredPrefecture(prefectureName);
            }}
            onMouseLeave={() => setHoveredPrefecture(null)}
          />
        );
      })}
    </svg>
  );
};
