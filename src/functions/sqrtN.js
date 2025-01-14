export const sqrtN = (value, n) => {
  if (value === 0) {
    return 0;
  }
  if (value < 0) {
    return -Math.pow(-value, 1 / n);
  }
  return Math.pow(value, 1 / n);
};
