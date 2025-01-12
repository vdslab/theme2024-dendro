import { selectPrefColor } from "../../styles/style";

export const SelectedPrefecture = ({
  features,
  selectedPrefecture,
  pathGenerator,
  setSelectedPrefecture,
}) => {
  const feature = features.find(
    (feature) => feature.properties.name === selectedPrefecture
  );
  return (
    <>
      {feature && (
        <path
          d={pathGenerator(feature)}
          fill={selectPrefColor}
          stroke="#000"
          strokeWidth={0.5}
          onClick={() => setSelectedPrefecture(null)}
        />
      )}
    </>
  );
};
