/*
dataの形式

data = [
  {
    value: 10,
    label: "A",
    color: "#FF6384",
  }]
*/

export const PieChart = ({ data, width, height, threshold = 0.05 }) => {
  // 合計値を計算
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // 閾値未満の項目を「その他」にまとめる
  let cumulativeValue = 0;
  const processedData = [];
  let otherValue = 0;

  data.forEach((item) => {
    if (item.value / total < threshold) {
      // 閾値未満の項目を「その他」に加算
      otherValue += item.value;
    } else {
      // 閾値以上の項目はそのまま追加
      processedData.push(item);
    }
  });

  // 「その他」を追加（もし値がある場合）
  if (otherValue > 0) {
    processedData.push({
      value: otherValue,
      label: "その他",
      color: "#d3d3d3", // 「その他」の色
    });
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {processedData.map((item, index) => {
        const startAngle =
          (cumulativeValue / total) * 2 * Math.PI - Math.PI / 2;
        cumulativeValue += item.value;
        const endAngle = (cumulativeValue / total) * 2 * Math.PI - Math.PI / 2;

        const x1 = width / 2 + (width / 2) * Math.cos(startAngle);
        const y1 = height / 2 + (height / 2) * Math.sin(startAngle);
        const x2 = width / 2 + (width / 2) * Math.cos(endAngle);
        const y2 = height / 2 + (height / 2) * Math.sin(endAngle);

        const largeArcFlag = item.value > total / 2 ? 1 : 0;

        const labelAngle = (startAngle + endAngle) / 2;
        const labelX = width / 2 + (width / 2.5) * Math.cos(labelAngle);
        const labelY = height / 2 + (height / 2.5) * Math.sin(labelAngle);

        return (
          <g key={index}>
            <path
              d={`M${width / 2},${height / 2} L${x1},${y1} A${width / 2},${
                height / 2
              } 0 ${largeArcFlag},1 ${x2},${y2} Z`}
              fill={item.color}
            />
            <text
              x={labelX}
              y={labelY}
              fill="#000"
              fontSize="16"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
