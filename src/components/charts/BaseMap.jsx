import { basePrefColor } from "../../styles/style";

export const BaseMap = ({ features, pathGenerator, handleClick }) => {
  return (
    <>
      {features.map((feature) => {
        const prefectureId = feature.properties.pref;
        return (
          <path
            key={prefectureId}
            d={pathGenerator(feature)}
            fill={basePrefColor}
            stroke="#000"
            strokeWidth={0.2}
            onClick={() => handleClick(prefectureId)}
          />
        );
      })}
    </>
  );
};
