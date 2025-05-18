import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';

export const restrictAccountFeature = (req, res, next) => {
  const { id } = req.user;
  if (id === 2) {
    throw new ApiError(403, ERROR_MESSAGES.ACTION_NOT_ALLOWED_IN_DEMO);
  }

  next();
};
