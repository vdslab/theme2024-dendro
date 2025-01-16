export const nthRoot = (value, n) => {
  if (n === 0) {
    throw new Error("n cannot be zero");
  }
  if (value === 0) {
    return 0;
  }
  if (value < 0 && n % 2 === 0) {
    throw new Error("Cannot calculate even root of a negative number");
  }
  if (value < 0) {
    return -Math.pow(-value, 1 / n);
  }
  return Math.pow(value, 1 / n);
};
