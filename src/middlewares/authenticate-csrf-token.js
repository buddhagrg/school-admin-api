import { verifyCsrfToken } from '../utils/index.js';

export const authenticateCsrfToken = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'];
  const accessToken = req.cookies.accessToken;
  verifyCsrfToken(accessToken, csrfToken);
  next();
};
