/**
 * スパイラルツリーを使用したフローマップレイアウトの最適化
 * 論文「Flow Map Layout via Spiral Trees」に基づく実装
 */

/**
 * スパイラルツリーの制御点を計算する関数
 * @param {number} x1 - 始点のX座標
 * @param {number} y1 - 始点のY座標
 * @param {number} x2 - 終点のX座標
 * @param {number} y2 - 終点のY座標
 * @param {boolean} isMainBranch - メインブランチかどうか
 * @returns {Object} 制御点の座標
 */
export const calculateSpiralControlPoints = (x1, y1, x2, y2, isMainBranch = false) => {
  // 2点間の距離と角度を計算
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // 水平・垂直方向の距離
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  // スパイラルの曲率を決定
  // メインブランチ（幹）は比較的直線的に、サブブランチ（枝）はより曲線的に
  const curvature = isMainBranch 
    ? Math.min(0.3, Math.max(0.2, distance / 800))
    : Math.min(0.5, Math.max(0.3, distance / 500));

  // 制御点の計算
  let cpx1, cpy1, cpx2, cpy2;

  if (absX > absY) {
    // 水平方向の距離が大きい場合
    const sign = dx > 0 ? 1 : -1;
    const offsetY = sign * (isMainBranch 
      ? Math.min(15, absX / 20) 
      : Math.min(40, absX / 10));
    
    cpx1 = x1 + dx * curvature;
    cpy1 = y1 + offsetY;
    cpx2 = x2 - dx * curvature;
    cpy2 = y2 + offsetY;
  } else {
    // 垂直方向の距離が大きい場合
    const sign = dy > 0 ? 1 : -1;
    const offsetX = sign * (isMainBranch 
      ? Math.min(15, absY / 20) 
      : Math.min(40, absY / 10));
    
    cpx1 = x1 + offsetX;
    cpy1 = y1 + dy * curvature;
    cpx2 = x2 + offsetX;
    cpy2 = y2 - dy * curvature;
  }

  return { cpx1, cpy1, cpx2, cpy2 };
};

/**
 * スパイラルツリーのパスを生成する関数
 * @param {number} x1 - 始点のX座標
 * @param {number} y1 - 始点のY座標
 * @param {number} x2 - 終点のX座標
 * @param {number} y2 - 終点のY座標
 * @param {boolean} isMainBranch - メインブランチかどうか
 * @returns {Object} パスと終点での接線方向
 */
export const createSpiralPath = (x1, y1, x2, y2, isMainBranch = false) => {
  // 制御点を計算
  const { cpx1, cpy1, cpx2, cpy2 } = calculateSpiralControlPoints(
    x1, y1, x2, y2, isMainBranch
  );

  // 三次ベジェ曲線のパスを生成
  const path = `M ${x1} ${y1} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
  
  // 終点での接線方向を計算（矢印の向きに使用）
  const endTangent = (Math.atan2(y2 - cpy2, x2 - cpx2) * 180) / Math.PI;

  return {
    path,
    endTangent,
    controlPoints: { cpx1, cpy1, cpx2, cpy2 }
  };
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
