"use strict";

const sumNumberValues = (obj) => {
  const validKeys = Object.keys(obj).filter(
    (x) => typeof obj[x] == Number || typeof obj[x] == "number"
  );
  const validObj = validKeys.map((x) => obj[x]);
  const sumValues = Object.values(validObj).reduce((a, b) => a + b);

  return sumValues;
};

// https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6
const removePropFromObject = (obj, prop) => {
  const { [prop]: _, ...rest } = obj;
  return { ...rest };
};
