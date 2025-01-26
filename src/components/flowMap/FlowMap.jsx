import * as d3 from "d3";
import React, { useContext, useEffect, useMemo } from "react";
import { DataContext } from "../../context/DataContext/DataContext";
import { drawObstacles } from "../../utils/drawUtils"; // 障害物描画関数
import { createWeightedTargetsFromData } from "../../utils/flowDataUtils"; // 重み付きターゲット生成関数
import { parseGeoJSONToObstacles } from "../../utils/geojsonUtils";
import { computeSpiralTreeWithObstacles } from "../../utils/spiralTreeUtils"; // スパイラルツリー生成アルゴリズム

export const FlowMap = ({
  flowData, // フローデータ (年度→発信元→受信先→フロー量)
  projection, // 地理座標を画面座標に変換するプロジェクション関数
  prefectureCenter, // 都道府県IDに対応する中心座標
  geojson,
}) => {
  const { selectedYear, selectedPrefecture } = useContext(DataContext);
  const obstacles = useMemo(() => parseGeoJSONToObstacles(geojson), [geojson]);

  useEffect(() => {
    // SVG 初期化
    const svg = d3.select("#flow-map");
    svg.selectAll("*").remove(); // 初期化

    // 障害物を描画
    drawObstacles(svg, obstacles);

    // 重み付きターゲットデータを作成
    const targets = createWeightedTargetsFromData(
      flowData, // フローデータ
      selectedPrefecture, // 選択された都道府県ID
      prefectureCenter, // 都道府県の中心座標
      projection // 地理座標変換プロジェクション
    );

    // スパイラルツリーのルート（発信元の座標）
    const root = {
      x: projection([
        prefectureCenter[selectedPrefecture].x,
        prefectureCenter[selectedPrefecture].y,
      ])[0],
      y: projection([
        prefectureCenter[selectedPrefecture].x,
        prefectureCenter[selectedPrefecture].y,
      ])[1],
    };

    // スパイラルツリー生成
    const angle = Math.PI / 6; // スパイラルツリーの角度
    const tree = computeSpiralTreeWithObstacles(
      root,
      targets,
      angle,
      obstacles
    );

    // 描画のためのスケール (色と太さ)
    const colorScale = d3
      .scaleLinear()
      .domain([0, 1]) // 重みの正規化範囲
      .range(["lightblue", "darkblue"]);

    const strokeWidthScale = d3.scaleLinear().domain([0, 1]).range([1, 10]); // ラインの太さの範囲

    // スパイラルツリーを描画
    const line = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveBasis);

    svg
      .selectAll("path.tree")
      .data(tree)
      .join("path")
      .attr("class", "tree")
      .attr("d", (d) => line(d.path)) // スパイラルパスを描画
      .attr("stroke", (d) => colorScale(d.weight)) // 重みに基づく色
      .attr("stroke-width", (d) => strokeWidthScale(d.weight)) // 重みに基づく太さ
      .attr("fill", "none");
  }, [
    flowData,
    selectedYear,
    projection,
    prefectureCenter,
    obstacles,
    selectedPrefecture,
  ]);

  return <svg id="flow-map" width={800} height={600}></svg>;
};
