const { randomInt } = require("node:crypto");

const generateSixDigitRandomNumber = () => {
  const n = randomInt(100000, 1000000);
  return n;
};

module.exports = { generateSixDigitRandomNumber };
