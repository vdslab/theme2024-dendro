export const logN = (base, value) => {
  if (typeof value !== "number" || typeof base !== "number") {
    throw new TypeError("Both value and base must be numbers.");
  }
  if (value <= 0) {
    throw new RangeError("Value must be greater than 0.");
  }
  if (base <= 0 || base === 1) {
    throw new RangeError("Base must be greater than 0 and not equal to 1.");
  }

  return Math.log(value) / Math.log(base);
};
