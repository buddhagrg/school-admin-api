import { verifyPwdManageToken } from '../utils/index.js';

export const authenticatePwdManageToken = (req, res, next) => {
  const { token } = req.query;
  const decoded = verifyPwdManageToken(token);
  req.user = decoded;
  next();
};
