export const createWeightedTargetsFromData = (
  data,              // フローデータ
  selectedPrefecture, // 選択された発信元都道府県 (例: "1")
  prefectureCenter,   // 都道府県IDに対応する中心座標
  projection          // 地理座標を画面座標に変換するプロジェクション関数
) => {

  const originData = data[selectedPrefecture]; // 発信元都道府県のデータを取得
  if (!originData) {
    console.error(`選択された発信元都道府県 (${selectedPrefecture}) のデータが見つかりません。`);
    return [];
  }

  const maxFlowValue = Math.max(...Object.values(originData)); // フロー量の最大値を取得

  const [startX, startY] = projection([
    prefectureCenter[selectedPrefecture].x,
    prefectureCenter[selectedPrefecture].y,
  ]);

  // 受信先都道府県のデータを処理
  return Object.keys(originData).map(targetId => {
    const flowValue = originData[targetId]; // フロー量を取得
    const center = prefectureCenter[targetId]; // 受信先の座標を取得

    if (!center || flowValue === 0) return null; // 座標がない、またはフロー量が0の場合はスキップ

    const [cx, cy] = projection([center.x, center.y]);

    // 距離を計算
    const distance = Math.sqrt((cx - startX) ** 2 + (cy - startY) ** 2);

    // 重みを計算
    const weight = calculateWeight(flowValue, distance, maxFlowValue);

    return {
      x: cx,            // 受信先の画面座標X
      y: cy,            // 受信先の画面座標Y
      weight,           // 重み (正規化された値)
    };
  }).filter(Boolean); // 無効なターゲットを除外
};

// 重み計算関数
const calculateWeight = (flowValue, distance, maxFlowValue) => {
  const normalizedFlow = flowValue / maxFlowValue; // フロー量を正規化
  const distanceFactor = 1 / (1 + distance);      // 距離による減衰効果
  return normalizedFlow * distanceFactor;
};
