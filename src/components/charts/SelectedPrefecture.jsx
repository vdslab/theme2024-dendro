import { useContext } from "react";
import { DataContext } from "../../context/DataContext/DataContext";
import { selectPrefColor } from "../../styles/style";

export const SelectedPrefecture = ({ features, pathGenerator }) => {
  const { selectedPrefecture, setSelectedPrefecture } = useContext(DataContext);
  const feature = features.find(
    (feature) => feature.properties.pref === selectedPrefecture
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
