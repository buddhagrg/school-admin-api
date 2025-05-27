import { ERROR_MESSAGES } from '../constants/index.js';
import { ApiError } from './index.js';

export const restrictAdminFeature = (req, res, next) => {
  const { userId } = req.body;
  if (Number(userId) === 2) {
    throw new ApiError(403, ERROR_MESSAGES.DISABLED_IN_DEMO_ACCOUNT);
  }

  next();
};
