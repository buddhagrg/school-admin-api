import { randomInt } from 'node:crypto';

export const generateSixDigitRandomNumber = () => {
  const n = randomInt(100000, 999999);
  return n;
};
