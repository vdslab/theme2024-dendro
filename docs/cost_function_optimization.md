# コスト関数に基づく樹状フローマップの最適化

## 1. 概要

樹状フローマップは、地理的な地点間の流れを視覚化するための効果的な手法です。本ドキュメントでは、樹状フローマップの幅を最適化するための新しいアプローチとして、コスト関数に基づく最適化手法について説明します。

## 2. 従来のヒューリスティックな幅計算の問題点

従来の実装（`calcWidth.js`）では、深さ優先探索（DFS）を使用して、フローの太さを計算していました。この方法には以下の問題点がありました：

1. **単純な正規化関数に依存**：フローの値を単純に正規化するだけで、視覚的な品質を考慮していませんでした。
2. **局所的な最適化のみ**：各ノードの幅を個別に計算するため、全体的な視覚的バランスが考慮されていませんでした。
3. **制約条件の明示的な考慮がない**：フローの保存則や滑らかさなどの制約条件が明示的に考慮されていませんでした。

## 3. コスト関数ベースの最適化アプローチ

新しい実装（`optimizeWidth.js`）では、コスト関数に基づく最適化アプローチを採用しています。このアプローチの主な特徴は以下の通りです：

1. **明示的なコスト関数の定義**：視覚的な品質を評価するための明示的なコスト関数を定義します。
2. **大域的な最適化**：全体的なコスト関数を最小化することで、大域的に最適な幅を求めます。
3. **複数の制約条件の統合**：流量保存、視覚的バランス、最小幅制約、滑らかさなどの複数の制約条件を統合します。
4. **勾配降下法による最適化**：勾配降下法を使用して、コスト関数を最小化します。

## 4. コスト関数の構成要素

コスト関数は以下の要素から構成されています：

### 4.1 流量保存コスト（Flow Conservation Cost）

親ノードの幅と子ノードの幅の合計の差を最小化します。これにより、フローの保存則が満たされます。

```javascript
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
```

### 4.2 視覚的バランスコスト（Visual Balance Cost）

同じ深さのノード間の幅のバランスを評価します。これにより、視覚的に均衡のとれた樹状フローマップが生成されます。

```javascript
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
    const avgWidth =
      nodes.reduce((sum, nodeId) => sum + getWidth(widths, nodeId), 0) /
      nodes.length;

    // 分散の計算
    const variance =
      nodes.reduce((sum, nodeId) => {
        const diff = getWidth(widths, nodeId) - avgWidth;
        return sum + diff * diff;
      }, 0) / nodes.length;

    cost += variance;
  }

  return cost;
};
```

### 4.3 最小幅制約コスト（Minimum Width Constraint Cost）

すべてのエッジに最小幅を保証します。これにより、細いフローも視認できるようになります。

```javascript
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
```

### 4.4 滑らかさコスト（Smoothness Cost）

幅の急激な変化を抑制します。これにより、滑らかな幅の変化が実現されます。

```javascript
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
```

## 5. 最適化アルゴリズム

コスト関数を最小化するために、勾配降下法を使用しています。勾配降下法は、コスト関数の勾配を計算し、その勾配の方向に幅を更新することで、コスト関数の最小値を探索するアルゴリズムです。

```javascript
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
```

勾配の計算には、数値微分を使用しています：

```javascript
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
```

## 6. パラメータ調整

コスト関数の重みや最適化パラメータは、`CONFIG`オブジェクトで定義されています：

```javascript
const CONFIG = {
  // 最適化パラメータ
  learningRate: 0.01, // 学習率
  iterations: 100, // 最大反復回数
  convergenceThreshold: 0.001, // 収束閾値

  // 幅のパラメータ
  minWidth: 1.0, // 最小幅
  maxWidth: 8.0, // 最大幅

  // コスト関数の重み
  flowConservationWeight: 1.0, // 流量保存の重み
  visualBalanceWeight: 0.5, // 視覚的バランスの重み
  minWidthWeight: 0.8, // 最小幅制約の重み
  smoothnessWeight: 0.3, // 滑らかさの重み

  // 正規化パラメータ
  root: 2.5, // 乗根の値
};
```

これらのパラメータを調整することで、樹状フローマップの視覚的な品質を制御できます：

- **学習率（learningRate）**：大きな値を設定すると最適化が速くなりますが、発散する可能性があります。小さな値を設定すると最適化が安定しますが、収束に時間がかかります。
- **最大反復回数（iterations）**：最適化の最大ステップ数です。大きな値を設定すると最適化の精度が向上しますが、計算時間が増加します。
- **収束閾値（convergenceThreshold）**：この値よりもコスト関数の変化が小さくなると、最適化を終了します。
- **最小幅（minWidth）と最大幅（maxWidth）**：フローの幅の範囲を制御します。
- **コスト関数の重み**：各コスト関数の重要度を制御します。例えば、`flowConservationWeight`を大きくすると、フローの保存則が重視されます。

## 7. 改善点と今後の課題

コスト関数ベースの最適化アプローチにより、樹状フローマップの視覚的な品質が向上しましたが、まだ改善の余地があります：

1. **計算効率の向上**：現在の実装では、勾配の計算に数値微分を使用していますが、解析的な勾配計算を実装することで、計算効率を向上させることができます。
2. **より高度な最適化アルゴリズム**：勾配降下法の代わりに、L-BFGS（Limited-memory Broyden–Fletcher–Goldfarb–Shanno）などのより高度な最適化アルゴリズムを使用することで、収束速度と精度を向上させることができます。
3. **ユーザー制御の強化**：ユーザーがコスト関数の重みやパラメータを対話的に調整できるようにすることで、より柔軟な視覚化が可能になります。
4. **動的なデータへの対応**：時間とともに変化するデータに対して、滑らかなアニメーションを生成するための最適化手法を開発することができます。

## 8. まとめ

コスト関数に基づく最適化アプローチは、樹状フローマップの視覚的な品質を向上させるための効果的な手法です。明示的なコスト関数を定義し、それを最小化することで、フローの保存則、視覚的バランス、最小幅制約、滑らかさなどの複数の制約条件を満たす最適な幅を求めることができます。

このアプローチは、従来のヒューリスティックな幅計算よりも柔軟で、より高品質な樹状フローマップを生成することができます。
