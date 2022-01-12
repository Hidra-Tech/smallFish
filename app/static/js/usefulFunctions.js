"use strict";

const sumNumberValues = (obj) => {
  const parsedObj = Object.values(obj).map((x) => Number.parseFloat(x));
  const validKeys = Object.keys(parsedObj).filter((x) => isNaN(x));
  console.log(validKeys);
  const validObj = validKeys.map((x) => obj[x]);
  const sumValues = Object.values(validObj).reduce((a, b) => a + b);

  return sumValues;
};
