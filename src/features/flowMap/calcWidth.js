export const calcWidth = (flowData, start) => {
  const limit = 0.1;
  const maxValue = 3;

  const maxFlow = Math.max(
    ...Object.entries(flowData[start])
      .filter(([key]) => key !== 48 && key !== String(start))
      .map(([, value]) => value)
  );

  const widths = Object.entries(flowData[start]).reduce((acc, [key, value]) => {
    if (key === 48 || key === String(start)) {
      return acc;
    }
    const w = (value / maxFlow) * maxValue;
    const obj = {
      strokeWidth: w,
      strokeDasharray: w <= limit ? limit : undefined,
    };
    acc[key] = obj;
    return acc;
  }, {});

  console.log(widths);
  return widths;
};
