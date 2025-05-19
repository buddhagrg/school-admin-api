import { env } from '../config/index.js';
import { ApiError, verifyToken } from '../utils/index.js';

export const handleEmailVerificationToken = (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    throw new ApiError(404, 'Invalid token');
  }

  const decodeToken = verifyToken(token, env.EMAIL_VERIFICATION_TOKEN_SECRET);
  if (!decodeToken) {
    throw new ApiError(400, 'Invalid token');
  }
  req.user = decodeToken;
  next();
};
