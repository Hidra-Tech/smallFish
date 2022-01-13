"use strict";

const sumNumberValues = (obj) => {
  const validKeys = Object.keys(obj).filter(
    (x) => typeof obj[x] == Number || typeof obj[x] == "number"
  );
  console.log(validKeys);
  const validObj = validKeys.map((x) => obj[x]);
  const sumValues = Object.values(validObj).reduce((a, b) => a + b);

  return sumValues;
};
