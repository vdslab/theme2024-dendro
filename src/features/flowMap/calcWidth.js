import { sqrtN } from "../../functions/sqrtN";

export const calcWidth = (flowData, start, maxValue) => {
  const lowerLimit = 0.1;
  const upperLimit = 3;
  const widths = Object.entries(flowData[start]).reduce((acc, [key, value]) => {
    if (key === 48 || key === String(start)) {
      return acc;
    }
    const w = (sqrtN(value, 3) / sqrtN(maxValue, 3)) * upperLimit;
    const obj = {
      strokeWidth: w,
      strokeDasharray: w <= lowerLimit ? lowerLimit : undefined,
    };
    acc[key] = obj;
    return acc;
  }, {});

  return widths;
};
