import { verifyAccessToken } from '../utils/index.js';

export const authenticateAccessToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  const decoded = verifyAccessToken(token);
  req.user = decoded;
  next();
};
