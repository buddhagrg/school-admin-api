import { verifyEmailVerificationToken } from '../utils/index.js';

export const authenticateEmailVerificationToken = (req, res, next) => {
  const { token } = req.query;
  const decoded = verifyEmailVerificationToken(token);
  req.user = decoded;
  next();
};
