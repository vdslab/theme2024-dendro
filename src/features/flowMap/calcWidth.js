import { nthRoot } from "../../functions/nthRoot";
import { isNullOrUndefined } from "../../functions/nullOrUndefined";

export const calcWidth = (flowData, start, maxValue) => {
  if (isNullOrUndefined(flowData[start])) {
    return null;
  }

  const lowerLimit = 0.1;
  const upperLimit = 3;
  const nhtRoot = 2.7;
  const widths = Object.entries(flowData[start]).reduce((acc, [key, value]) => {
    if (key === 48 || key === String(start)) {
      return acc;
    }
    const w =
      (nthRoot(value, nhtRoot) / nthRoot(maxValue, nhtRoot)) * upperLimit;
    const obj = {
      strokeWidth: w,
      strokeDasharray: w <= lowerLimit ? lowerLimit : undefined,
    };
    acc[key] = obj;
    return acc;
  }, {});

  return widths;
};
