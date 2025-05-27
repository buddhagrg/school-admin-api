import { addMilliseconds, formatDistanceStrict } from 'date-fns';

export const getDateFromMilliseconds = (ms) => {
  const now = new Date();
  const result = addMilliseconds(now, Number(ms));
  return result;
};

export const getDateDistanceInWords = (ms) => {
  const now = new Date();
  const futureDate = addMilliseconds(now, Number(ms));
  const result = formatDistanceStrict(now, futureDate);
  return result;
};
