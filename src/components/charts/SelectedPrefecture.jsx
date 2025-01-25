import { useContext } from "react";
import { DataContext } from "../../context/DataContext/DataContext";
import { selectPrefColor } from "../../styles/style";

export const SelectedPrefecture = ({ feature, pathGenerator }) => {
  const { setSelectedPrefecture } = useContext(DataContext);
  return (
    <>
      {feature && (
        <path
          d={pathGenerator(feature)}
          fill={selectPrefColor}
          stroke="#000"
          strokeWidth={0.5}
          onClick={() => setSelectedPrefecture(null)}
          style={{ cursor: "pointer" }}
        />
      )}
    </>
  );
};
