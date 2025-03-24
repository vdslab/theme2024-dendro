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
  // 最小の太さを設定（これより細くならない）
  const minWidth = 1.0;
  // 乗根の値を小さくして（2.5乗根）、値の差をより明確にする
  const root = 2.5;
  
  // 正規化された値を計算
  const normalizedWidth = (nthRoot(value, root) / nthRoot(maxValue, root)) * upperLimit;
  
  // 最小値との比較で大きい方を返す
  return Math.max(normalizedWidth, minWidth);
};
