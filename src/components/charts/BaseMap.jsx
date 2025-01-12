import { basePrefColor } from "../../styles/style";

export const BaseMap = ({ features, pathGenerator, setSelectedPrefecture }) => {
  return (
    <>
      {features.map((feature, i) => {
        const prefectureName = feature.properties.name;
        return (
          <path
            key={i}
            d={pathGenerator(feature)}
            fill={basePrefColor}
            stroke="#000"
            strokeWidth={0.2}
            onClick={() => setSelectedPrefecture(prefectureName)}
          />
        );
      })}
    </>
  );
};
