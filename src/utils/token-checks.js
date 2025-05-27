import { env } from '../config/index.js';
import { generateCsrfHmacHash } from './csrf.js';
import { verifyToken } from './token-services.js';

export const verifyAccessToken = (token) => {
  return verifyToken(token, env.JWT_ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return verifyToken(token, env.JWT_REFRESH_TOKEN_SECRET);
};

export const verifyCsrfToken = (accessToken, csrfToken) => {
  const decodedAccessToken = verifyAccessToken(accessToken);

  const hmacHashedCsrf = generateCsrfHmacHash(csrfToken);
  if (decodedAccessToken.csrf_hmac !== hmacHashedCsrf) {
    throw new ApiError(403, 'Invalid or missing CSRF token');
  }
};

export const verifyEmailVerificationToken = (token) => {
  return verifyToken(token, env.EMAIL_VERIFICATION_TOKEN_SECRET);
};

export const verifyPwdManageToken = (token) => {
  return verifyToken(token, env.PASSWORD_MANAGE_TOKEN_SECRET);
};
