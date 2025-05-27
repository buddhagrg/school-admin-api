import { ERROR_MESSAGES } from '../constants/index.js';
import { ApiError } from './index.js';

export const restrictAdminFeature = (req, res, next) => {
  const { userId } = req.body;
  console.log('userId: ', userId);
  console.log('are equal: ', Number(userId) === 2);
  if (Number(userId) === 2) {
    throw new ApiError(403, ERROR_MESSAGES.ACTION_NOT_ALLOWED_IN_DEMO);
  }

  next();
};
