export const isNullOrUndefined = (value) => {
  return value === null || value === undefined;
};

export const isNotNullOrUndefined = (value) => {
  return !isNullOrUndefined(value);
};

export const isNullOrUndefinedOrEmpty = (value) => {
  return value === null || value === undefined || value === "";
};

export const isNotNullOrUndefinedOrEmpty = (value) => {
  return !isNullOrUndefinedOrEmpty(value);
};

export const isNullOrUndefinedOrEmptyArray = (value) => {
  return value === null || value === undefined || value.length === 0;
};

export const isNotNullOrUndefinedOrEmptyArray = (value) => {
  return !isNullOrUndefinedOrEmptyArray(value);
};
