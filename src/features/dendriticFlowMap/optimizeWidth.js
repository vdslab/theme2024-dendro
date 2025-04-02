/**
 * 樹状フローマップの幅最適化モジュール
 * 
 * 実装内容：
 * 1. コスト関数に基づく幅の最適化
 *    - 明示的なコスト関数の最小化による最適な幅の決定
 *    - 複数の制約条件を考慮した総合的な最適化
 *    - 勾配降下法による効率的な最適解の探索
 * 
 * 2. コスト関数の構成要素
 *    - 流量保存コスト：親ノードの幅は子ノードの幅の合計に比例
 *    - 視覚的バランスコスト：視覚的に適切なバランスを保つ
 *    - 最小幅制約コスト：すべてのエッジに最小幅を保証
 *    - 滑らかさコスト：幅の急激な変化を抑制
 * 
 * 改善点：
 * - ヒューリスティックな計算からコスト関数ベースの最適化へ
 * - 複数の制約条件の統合による総合的な品質向上
 * - パラメータ調整による柔軟な視覚表現の実現
 */

import { nthRoot } from "../../functions/nthRoot";

// 設定パラメータ
const CONFIG = {
  // 最適化パラメータ
  learningRate: 0.01,      // 学習率
  iterations: 100,         // 最大反復回数
  convergenceThreshold: 0.001, // 収束閾値
  
  // 幅のパラメータ
  minWidth: 1.0,           // 最小幅
  maxWidth: 8.0,           // 最大幅
  
  // コスト関数の重み
  flowConservationWeight: 1.0,  // 流量保存の重み
  visualBalanceWeight: 0.5,     // 視覚的バランスの重み
  minWidthWeight: 0.8,          // 最小幅制約の重み
  smoothnessWeight: 0.3,        // 滑らかさの重み
  
  // 正規化パラメータ
  root: 2.5,               // 乗根の値
};

/**
 * コスト関数に基づく幅の最適化
 * @param {Object} flowData - フローデータ
 * @param {Object} dendriticMapData - 樹状マップデータ
 * @param {number} selectedPrefecture - 選択された都道府県
 * @param {number} maxValue - 最大値
 * @returns {Object} 最適化された幅
 */
export const optimizeWidth = (
  flowData,
  dendriticMapData,
  selectedPrefecture,
  maxValue
) => {
  // 初期幅の計算（従来のcalcWidth関数と同様）
  const initialWidths = calculateInitialWidths(
    flowData,
    dendriticMapData,
    selectedPrefecture,
    maxValue
  );
  
  // 樹状構造の解析
  const treeStructure = analyzeTreeStructure(
    dendriticMapData[selectedPrefecture]
  );
  
  // コスト関数に基づく最適化
  const optimizedWidths = minimizeCostFunction(
    initialWidths,
    treeStructure,
    flowData,
    maxValue
  );
  
  return optimizedWidths;
};

/**
 * 初期幅の計算
 * @param {Object} flowData - フローデータ
 * @param {Object} dendriticMapData - 樹状マップデータ
 * @param {number} selectedPrefecture - 選択された都道府県
 * @param {number} maxValue - 最大値
 * @returns {Object} 初期幅
 */
const calculateInitialWidths = (
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

/**
 * 値の正規化
 * @param {number} value - 正規化する値
 * @param {number} maxValue - 最大値
 * @returns {number} 正規化された値
 */
const normalization = (value, maxValue) => {
  // 上限値を大きくして、太さの範囲を広げる
  const upperLimit = CONFIG.maxWidth;
  // 最小の太さを設定（これより細くならない）
  const minWidth = CONFIG.minWidth;
  // 乗根の値
  const root = CONFIG.root;
  
  // 正規化された値を計算
  const normalizedWidth = (nthRoot(value, root) / nthRoot(maxValue, root)) * upperLimit;
  
  // 最小値との比較で大きい方を返す
  return Math.max(normalizedWidth, minWidth);
};

/**
 * 樹状構造の解析
 * @param {Object} treeData - 樹状データ
 * @returns {Object} 解析された樹状構造
 */
const analyzeTreeStructure = (treeData) => {
  const structure = {
    nodes: new Set(),
    edges: [],
    children: {},
    parent: {},
    depth: {},
  };
  
  const dfs = (id, depth = 0) => {
    structure.nodes.add(id);
    structure.depth[id] = depth;
    
    // 子ノードの処理
    structure.children[id] = [];
    
    // 都道府県の子ノード
    for (const prefId of treeData[id].prefectureChildren) {
      const prefNodeId = `pref_${prefId}`;
      structure.nodes.add(prefNodeId);
      structure.children[id].push(prefNodeId);
      structure.parent[prefNodeId] = id;
      structure.depth[prefNodeId] = depth + 1;
      structure.edges.push([id, prefNodeId]);
    }
    
    // 中間ノードの子ノード
    for (const nodeId of treeData[id].nodeChildren) {
      structure.children[id].push(nodeId);
      structure.parent[nodeId] = id;
      structure.edges.push([id, nodeId]);
      dfs(nodeId, depth + 1);
    }
  };
  
  dfs(0);
  return structure;
};

/**
 * コスト関数の最小化
 * @param {Object} initialWidths - 初期幅
 * @param {Object} treeStructure - 樹状構造
 * @param {Object} flowData - フローデータ
 * @param {number} maxValue - 最大値
 * @returns {Object} 最適化された幅
 */
const minimizeCostFunction = (
  initialWidths,
  treeStructure,
  flowData,
  maxValue
) => {
  // 最適化対象の幅
  let widths = {
    prefecture: { ...initialWidths.prefecture },
    node: { ...initialWidths.node },
  };
  
  // 勾配降下法による最適化
  let prevCost = Infinity;
  
  for (let iter = 0; iter < CONFIG.iterations; iter++) {
    // 現在のコスト計算
    const currentCost = calculateTotalCost(widths, treeStructure, flowData);
    
    // 収束判定
    if (Math.abs(prevCost - currentCost) < CONFIG.convergenceThreshold) {
      break;
    }
    prevCost = currentCost;
    
    // 勾配の計算と幅の更新
    const gradients = calculateGradients(widths, treeStructure, flowData);
    updateWidths(widths, gradients);
    
    // 制約条件の適用
    applyConstraints(widths, maxValue);
  }
  
  return widths;
};

/**
 * 総コストの計算
 * @param {Object} widths - 幅
 * @param {Object} treeStructure - 樹状構造
 * @param {Object} flowData - フローデータ
 * @returns {number} 総コスト
 */
const calculateTotalCost = (widths, treeStructure, flowData) => {
  // 流量保存コスト
  const flowConservationCost = calculateFlowConservationCost(widths, treeStructure);
  
  // 視覚的バランスコスト
  const visualBalanceCost = calculateVisualBalanceCost(widths, treeStructure);
  
  // 最小幅制約コスト
  const minWidthCost = calculateMinWidthCost(widths);
  
  // 滑らかさコスト
  const smoothnessCost = calculateSmoothnessCost(widths, treeStructure);
  
  // 総コスト
  return (
    CONFIG.flowConservationWeight * flowConservationCost +
    CONFIG.visualBalanceWeight * visualBalanceCost +
    CONFIG.minWidthWeight * minWidthCost +
    CONFIG.smoothnessWeight * smoothnessCost
  );
};

/**
 * 流量保存コストの計算
 * @param {Object} widths - 幅
 * @param {Object} treeStructure - 樹状構造
 * @returns {number} 流量保存コスト
 */
const calculateFlowConservationCost = (widths, treeStructure) => {
  let cost = 0;
  
  // 各ノードについて、親ノードの幅と子ノードの幅の合計の差を計算
  for (const nodeId of treeStructure.nodes) {
    if (nodeId === 0) continue; // ルートノードはスキップ
    
    const parentId = treeStructure.parent[nodeId];
    if (!parentId) continue;
    
    const parentWidth = getWidth(widths, parentId);
    const childrenWidth = treeStructure.children[nodeId]
      ? treeStructure.children[nodeId].reduce(
          (sum, childId) => sum + getWidth(widths, childId),
          0
        )
      : 0;
    
    // 親ノードの幅と子ノードの幅の合計の差の二乗
    if (childrenWidth > 0) {
      const diff = parentWidth - childrenWidth;
      cost += diff * diff;
    }
  }
  
  return cost;
};

/**
 * 視覚的バランスコストの計算
 * @param {Object} widths - 幅
 * @param {Object} treeStructure - 樹状構造
 * @returns {number} 視覚的バランスコスト
 */
const calculateVisualBalanceCost = (widths, treeStructure) => {
  let cost = 0;
  
  // 同じ深さのノード間の幅のバランスを評価
  const nodesByDepth = {};
  
  for (const nodeId of treeStructure.nodes) {
    const depth = treeStructure.depth[nodeId];
    if (!nodesByDepth[depth]) {
      nodesByDepth[depth] = [];
    }
    nodesByDepth[depth].push(nodeId);
  }
  
  // 各深さについて、ノード間の幅の分散を計算
  for (const depth in nodesByDepth) {
    const nodes = nodesByDepth[depth];
    if (nodes.length <= 1) continue;
    
    // 平均幅の計算
    const avgWidth = nodes.reduce(
      (sum, nodeId) => sum + getWidth(widths, nodeId),
      0
    ) / nodes.length;
    
    // 分散の計算
    const variance = nodes.reduce(
      (sum, nodeId) => {
        const diff = getWidth(widths, nodeId) - avgWidth;
        return sum + diff * diff;
      },
      0
    ) / nodes.length;
    
    cost += variance;
  }
  
  return cost;
};

/**
 * 最小幅制約コストの計算
 * @param {Object} widths - 幅
 * @returns {number} 最小幅制約コスト
 */
const calculateMinWidthCost = (widths) => {
  let cost = 0;
  
  // 都道府県の幅
  for (const prefId in widths.prefecture) {
    const width = widths.prefecture[prefId];
    if (width < CONFIG.minWidth) {
      const diff = CONFIG.minWidth - width;
      cost += diff * diff;
    }
  }
  
  // ノードの幅
  for (const nodeId in widths.node) {
    const width = widths.node[nodeId];
    if (width < CONFIG.minWidth) {
      const diff = CONFIG.minWidth - width;
      cost += diff * diff;
    }
  }
  
  return cost;
};

/**
 * 滑らかさコストの計算
 * @param {Object} widths - 幅
 * @param {Object} treeStructure - 樹状構造
 * @returns {number} 滑らかさコスト
 */
const calculateSmoothnessCost = (widths, treeStructure) => {
  let cost = 0;
  
  // 各エッジについて、幅の変化率を計算
  for (const [parentId, childId] of treeStructure.edges) {
    const parentWidth = getWidth(widths, parentId);
    const childWidth = getWidth(widths, childId);
    
    // 幅の変化率の二乗
    const ratio = parentWidth / (childWidth + 0.001); // ゼロ除算を避ける
    const optimalRatio = 1.2; // 理想的な変化率
    const diff = ratio - optimalRatio;
    cost += diff * diff;
  }
  
  return cost;
};

/**
 * 勾配の計算
 * @param {Object} widths - 幅
 * @param {Object} treeStructure - 樹状構造
 * @param {Object} flowData - フローデータ
 * @returns {Object} 勾配
 */
const calculateGradients = (widths, treeStructure, flowData) => {
  const gradients = {
    prefecture: {},
    node: {},
  };
  
  // 数値微分による勾配計算
  const epsilon = 0.01;
  
  // 都道府県の幅の勾配
  for (const prefId in widths.prefecture) {
    // 元のコスト
    const originalCost = calculateTotalCost(widths, treeStructure, flowData);
    
    // 幅を少し増やしたときのコスト
    widths.prefecture[prefId] += epsilon;
    const increasedCost = calculateTotalCost(widths, treeStructure, flowData);
    widths.prefecture[prefId] -= epsilon;
    
    // 勾配の計算
    gradients.prefecture[prefId] = (increasedCost - originalCost) / epsilon;
  }
  
  // ノードの幅の勾配
  for (const nodeId in widths.node) {
    // 元のコスト
    const originalCost = calculateTotalCost(widths, treeStructure, flowData);
    
    // 幅を少し増やしたときのコスト
    widths.node[nodeId] += epsilon;
    const increasedCost = calculateTotalCost(widths, treeStructure, flowData);
    widths.node[nodeId] -= epsilon;
    
    // 勾配の計算
    gradients.node[nodeId] = (increasedCost - originalCost) / epsilon;
  }
  
  return gradients;
};

/**
 * 幅の更新
 * @param {Object} widths - 幅
 * @param {Object} gradients - 勾配
 */
const updateWidths = (widths, gradients) => {
  // 都道府県の幅の更新
  for (const prefId in gradients.prefecture) {
    widths.prefecture[prefId] -= CONFIG.learningRate * gradients.prefecture[prefId];
  }
  
  // ノードの幅の更新
  for (const nodeId in gradients.node) {
    widths.node[nodeId] -= CONFIG.learningRate * gradients.node[nodeId];
  }
};

/**
 * 制約条件の適用
 * @param {Object} widths - 幅
 * @param {number} maxValue - 最大値
 */
const applyConstraints = (widths, maxValue) => {
  // 都道府県の幅の制約
  for (const prefId in widths.prefecture) {
    widths.prefecture[prefId] = Math.max(
      CONFIG.minWidth,
      Math.min(CONFIG.maxWidth, widths.prefecture[prefId])
    );
  }
  
  // ノードの幅の制約
  for (const nodeId in widths.node) {
    widths.node[nodeId] = Math.max(
      CONFIG.minWidth,
      Math.min(CONFIG.maxWidth, widths.node[nodeId])
    );
  }
};

/**
 * ノードIDから幅を取得
 * @param {Object} widths - 幅
 * @param {string|number} id - ノードID
 * @returns {number} 幅
 */
const getWidth = (widths, id) => {
  if (typeof id === 'string' && id.startsWith('pref_')) {
    const prefId = parseInt(id.substring(5));
    return widths.prefecture[prefId] || CONFIG.minWidth;
  } else {
    return widths.node[id] || CONFIG.minWidth;
  }
};
