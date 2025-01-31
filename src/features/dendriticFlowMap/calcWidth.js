import { nthRoot } from "../../functions/nthRoot";

export const calcWidth = (
  flowData,
  dendriticMapData,
  selectedPrefecture,
  maxValue
) => {
  const widths = {
    prefecture: {},
    node: {},
  };
  const dfs = (id) => {
    let sum = 0;

    for (const prefId of dendriticMapData[selectedPrefecture][id]
      .prefectureChildren) {
      const value = flowData[prefId] || 0;
      sum += value;
      widths.prefecture[prefId] = normalization(value, maxValue);
    }

    for (const nodeId of dendriticMapData[selectedPrefecture][id]
      .nodeChildren) {
      sum += dfs(nodeId);
    }

    widths.node[id] = normalization(sum, maxValue);
    return sum;
  };

  dfs(0);
  return widths;
};

const normalization = (value, maxValue) => {
  const upperLimit = 5;
  const root = 5;
  return (nthRoot(value, root) / nthRoot(maxValue, root)) * upperLimit;
};
