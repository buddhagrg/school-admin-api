import { env } from '../config/index.js';
import { verifyToken, ApiError } from '../utils/index.js';

export const handleSetupPasswordToken = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    throw new ApiError(404, 'Invalid token');
  }
  const decodeToken = verifyToken(token, env.PASSWORD_SETUP_TOKEN_SECRET);
  if (!decodeToken || !decodeToken.demoId) {
    throw new ApiError(400, 'Invalid token');
  }
  req.user = decodeToken;
  next();
};
