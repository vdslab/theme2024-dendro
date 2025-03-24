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
  // 上限値を大きくして、太さの範囲を広げる
  const upperLimit = 8;
  // 乗根の値を小さくして（3乗根）、値の差をより明確にする
  const root = 3;
  return (nthRoot(value, root) / nthRoot(maxValue, root)) * upperLimit;
};
