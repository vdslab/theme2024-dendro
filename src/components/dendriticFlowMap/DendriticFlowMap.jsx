import React, { useContext, useMemo } from "react";
import { prefectureIntersection } from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import { calcWidth } from "../../features/dendriticFlowMap/calcWidth";
import {
  calculateFlowColor,
  createSpiralPath,
} from "../../features/dendriticFlowMap/spiralTreeLayout";
import { useDataFetch } from "../../hooks/useDataFetch";

export const DendriticFlowMap = ({
  flowData,
  projection,
  prefectureCenter,
}) => {
  const { data: dendriticMapData, isLoading } = useDataFetch(
    "data/dendriticFlowMapData.json"
  );

  const {
    selectedPrefecture,
    selectedDataType,
    peopleMaxValue,
    materialMaxValue,
  } = useContext(DataContext);

  const [startX, startY] = projection([
    prefectureCenter[selectedPrefecture].x,
    prefectureCenter[selectedPrefecture].y,
  ]);

  const maxValue = useMemo(
    () => (selectedDataType === "people" ? peopleMaxValue : materialMaxValue),
    [peopleMaxValue, materialMaxValue, selectedDataType]
  );

  const widths = useMemo(
    () =>
      !isLoading
        ? calcWidth(flowData, dendriticMapData, selectedPrefecture, maxValue)
        : 0,
    [flowData, maxValue, dendriticMapData, selectedPrefecture, isLoading]
  );

  // フローの色を決定する関数（spiralTreeLayout.jsから取得）
  const getFlowColor = (width, isEndPoint = false) => {
    return calculateFlowColor(width, selectedDataType, isEndPoint);
  };

  // スパイラルツリーを使用した曲線パスを生成する関数
  const createCurvedPath = (x1, y1, x2, y2, isNodePath = false) => {
    // スパイラルツリーレイアウトを使用して曲線を生成
    // isNodePathはメインブランチかどうかを示す（メインブランチはより直線的に）
    return createSpiralPath(x1, y1, x2, y2, isNodePath);
  };

  // 隣接する都道府県かどうかを判断する関数
  const isAdjacentPrefecture = (prefId1, prefId2, threshold = 150) => {
    if (!prefectureCenter[prefId1] || !prefectureCenter[prefId2]) return false;

    // 都道府県の中心点間の距離を計算
    const [x1, y1] = projection([
      prefectureCenter[prefId1].x,
      prefectureCenter[prefId1].y,
    ]);
    const [x2, y2] = projection([
      prefectureCenter[prefId2].x,
      prefectureCenter[prefId2].y,
    ]);

    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // 距離が閾値以下なら隣接していると判断
    return distance < threshold;
  };

  // 県境のポイントとの距離を計算する関数
  const distanceToBorderPoint = (prefId, borderPointId) => {
    // borderPointId が 0 の場合は、県境のポイントではなく選択された都道府県の中心点
    if (borderPointId === 0) return Infinity;

    // prefectureCenter または prefectureIntersection が存在しない場合は Infinity を返す
    if (!prefectureCenter[prefId] || !prefectureIntersection[borderPointId - 1])
      return Infinity;

    try {
      const [x1, y1] = projection([
        prefectureCenter[prefId].x,
        prefectureCenter[prefId].y,
      ]);
      const { x: x2, y: y2 } = prefectureIntersection[borderPointId - 1];

      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    } catch (error) {
      console.error("Error calculating distance to border point:", error);
      return Infinity;
    }
  };

  const dendriticFlowMap = (id) => {
    try {
      const { prefectureChildren, nodeChildren } =
        dendriticMapData[selectedPrefecture][id];
      const { x: stX, y: stY } =
        id === 0 ? { x: startX, y: startY } : prefectureIntersection[id - 1];

      // 現在の都道府県ID（id=0の場合はselectedPrefecture）
      const currentPrefId = id === 0 ? selectedPrefecture : selectedPrefecture;

      return (
        <React.Fragment key={`fragment-${id}`}>
          {prefectureChildren.map((childId) => {
            const [enX, enY] = projection([
              prefectureCenter[childId].x,
              prefectureCenter[childId].y,
            ]);
            const w = widths.prefecture[childId];
            console.log("pref", childId, w);

            // 隣接する都道府県かどうかを判断
            const isAdjacent = isAdjacentPrefecture(currentPrefId, childId);

            // 県境のポイントとの距離を計算
            // id が 0 以外の場合（中間ノードからの接続の場合）は、そのノードとの距離を考慮
            const distanceToBorder =
              id !== 0 ? 0 : distanceToBorderPoint(childId, id);
            const distanceToCenter = isAdjacent
              ? Math.sqrt(Math.pow(enX - stX, 2) + Math.pow(enY - stY, 2))
              : Infinity;

            // 県境のポイントより中心点への距離が近い場合、または隣接している場合は直接矢印を伸ばす
            const shouldDrawDirect =
              isAdjacent ||
              (distanceToBorder > 0 && distanceToCenter < distanceToBorder);

            // 曲線パスと終点での接線方向を取得
            // 隣接する都道府県の場合や県境のポイントより近い場合は、より直線的な曲線を使用
            const { path, endTangent } = createCurvedPath(
              stX,
              stY,
              enX,
              enY,
              shouldDrawDirect
            );
            const color = getFlowColor(w, true);

            // 矢印マーカーのID（接線方向に基づいて回転させるため、一意のIDが必要）
            const markerId = `arrowhead-${childId}`;

            return (
              <React.Fragment key={childId}>
                <defs>
                  <marker
                    id={markerId}
                    markerWidth="4"
                    markerHeight="3"
                    refX="1"
                    refY="1.5"
                    orient={endTangent}
                  >
                    <polygon points="0 0.5, 2 1.5, 0 2.5" fill={color} />
                  </marker>
                </defs>
                <path
                  d={path}
                  stroke={color}
                  strokeWidth={w}
                  fill="none"
                  markerEnd={`url(#${markerId})`}
                  strokeLinecap="round"
                />
              </React.Fragment>
            );
          })}
          {nodeChildren.map((childId) => {
            const { x: enX, y: enY } = prefectureIntersection[childId - 1];
            const w = widths.node[childId];
            console.log("node", childId, w);

            // 曲線パスを取得（ノード間の接続なので isNodePath=true）
            const { path } = createCurvedPath(stX, stY, enX, enY, true);
            const color = getFlowColor(w);

            return (
              <React.Fragment key={childId}>
                <path
                  d={path}
                  stroke={color}
                  strokeWidth={w}
                  fill="none"
                  strokeLinecap="round"
                />
                {dendriticFlowMap(childId)}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    } catch (error) {
      console.error("Error in dendriticFlowMap:", error);
      return <></>;
    }
  };

  return <g>{dendriticFlowMap(0)}</g>;
};
