import { verifyRefreshToken } from '../utils/index.js';

export const authenticateRefreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  const decoded = verifyRefreshToken(token);
  req.user = decoded;
  next();
};
