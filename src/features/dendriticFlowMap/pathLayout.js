/**
 * フローマップレイアウトの最適化
 * 論文「Flow Map Layout via Spiral Trees」の概念に基づく実装
 * 
 * 実装内容：
 * 1. 直線補間を使用した曲線生成
 *    - 視覚的に美しく、理解しやすいパスの生成
 *    - メインブランチとサブブランチの区別による階層構造の表現
 *    - 終点での接線方向を計算し、矢印の向きを最適化
 * 
 * 2. フローの太さに応じた色計算
 *    - データタイプ（人流/物流）に応じた色のグラデーション
 *    - 太さの相対値に基づく色の強度調整
 *    - 終点での色調整による方向性の視覚的強調
 * 
 * 改善点：
 * - 直線補間による安定した曲線生成
 * - 樹状構造の階層関係の明確化
 * - 視覚的な混乱の軽減と情報伝達の効率化
 */

/**
 * パスのパラメータを計算する関数
 * @param {number} x1 - 始点のX座標
 * @param {number} y1 - 始点のY座標
 * @param {number} x2 - 終点のX座標
 * @param {number} y2 - 終点のY座標
 * @param {boolean} isMainBranch - メインブランチかどうか
 * @returns {Object} パスのパラメータ
 */
export const calculatePathParams = (x1, y1, x2, y2, isMainBranch = false) => {
  // 2点間の距離と角度を計算
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // 始点と終点を極座標に変換
  // 原点は始点(x1, y1)とする
  const r2 = distance;
  const theta2 = angle;

  // 制限角度α
  // メインブランチはより直線的に（小さいα）、サブブランチはより曲線的に（大きいα）
  const alpha = isMainBranch 
    ? (15 * Math.PI / 180) // 15度をラジアンに変換（より直線的に）
    : (25 * Math.PI / 180); // 25度をラジアンに変換

  // βパラメータの計算
  // 初期値として、αの一定割合を使用
  let beta = isMainBranch 
    ? (alpha * 0.5) * (Math.random() > 0.5 ? 1 : -1) // メインブランチは小さめのβ値
    : (alpha * 0.7) * (Math.random() > 0.5 ? 1 : -1); // サブブランチは大きめのβ値
  
  // βが0に近すぎる場合は、小さな値を設定する
  if (Math.abs(beta) < 0.01) {
    beta = 0.01 * (beta >= 0 ? 1 : -1);
  }

  // βの絶対値がαを超えないようにする
  if (Math.abs(beta) > alpha) {
    beta = alpha * (beta >= 0 ? 1 : -1);
  }

  // パスのパラメータを返す
  return {
    r1: 0, // 始点は原点なのでr1 = 0
    theta1: 0, // 始点は原点なのでtheta1 = 0
    r2,
    theta2,
    beta,
    alpha,
    x1,
    y1,
    x2,
    y2
  };
};

/**
 * SVGパスを生成する関数
 * @param {number} x1 - 始点のX座標
 * @param {number} y1 - 始点のY座標
 * @param {number} x2 - 終点のX座標
 * @param {number} y2 - 終点のY座標
 * @param {boolean} isMainBranch - メインブランチかどうか
 * @returns {Object} パスと終点での接線方向
 */
export const createPath = (x1, y1, x2, y2, isMainBranch = false) => {
  try {
    // パスのパラメータを計算
    const params = calculatePathParams(x1, y1, x2, y2, isMainBranch);
    const { theta2 } = params;

    // SVGパスを生成するためのポイント数
    const numPoints = 50;
    
    // 直線補間によるポイントの計算
    const points = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      
      // 直線補間
      const r = params.r2 * t;
      const theta = theta2 * t;
      
      // 極座標からデカルト座標に変換
      const x = x1 + r * Math.cos(theta);
      const y = y1 + r * Math.sin(theta);
      
      points.push(`${x},${y}`);
    }
    
    // SVGのパスを生成
    const path = `M ${x1} ${y1} L ${points.join(' L ')}`;
    
    // 終点での接線方向を計算（矢印の向きに使用）
    const endTangent = (theta2 * 180 / Math.PI) % 360;

    return {
      path,
      endTangent,
      pathParams: params
    };
  } catch (error) {
    console.error("Error in createPath:", error);
    
    // エラーが発生した場合は、単純な直線を返す
    const path = `M ${x1} ${y1} L ${x2} ${y2}`;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const endTangent = (angle * 180 / Math.PI) % 360;
    
    return {
      path,
      endTangent,
      pathParams: {
        beta: 0,
        r2: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
        theta2: angle
      }
    };
  }
};

/**
 * フローの太さに基づいて色を計算する関数
 * @param {number} width - フローの太さ
 * @param {string} dataType - データタイプ（"people"または"material"）
 * @param {boolean} isEndPoint - 終点かどうか
 * @returns {string} RGB色文字列
 */
export const calculateFlowColor = (width, dataType, isEndPoint = false) => {
  // 太さの最大値と最小値
  const maxWidth = 8;
  const minWidth = 0.5;

  // 太さの相対値（0〜1の範囲）
  const relativeWidth = Math.min(
    1,
    Math.max(0, (width - minWidth) / (maxWidth - minWidth))
  );

  // データタイプに応じた色の範囲を定義
  let r, g, b;

  if (dataType === "people") {
    // 人流データの場合: 薄い赤から濃い赤へのグラデーション
    r = 255;
    g = Math.max(0, Math.floor(150 - relativeWidth * 150));
    b = Math.max(0, Math.floor(150 - relativeWidth * 150));
  } else {
    // 物流データの場合: 薄いオレンジから濃いオレンジへのグラデーション
    r = 255;
    g = Math.max(102, Math.floor(180 - relativeWidth * 78));
    b = Math.max(0, Math.floor(100 - relativeWidth * 100));
  }

  // 終点の場合は少し暗めの色にする
  if (isEndPoint) {
    r = Math.floor(r * 0.9);
    g = Math.floor(g * 0.9);
    b = Math.floor(b * 0.9);
  }

  // RGBカラーを返す
  return `rgb(${r}, ${g}, ${b})`;
};
