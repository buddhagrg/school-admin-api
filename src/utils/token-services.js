import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { ApiError } from './api-error.js';
import { env } from '../config/index.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export const verifyToken = (token, secret) => {
  const INVALID_TOKEN = 'Invalid token';

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(400, ERROR_MESSAGES.LINK_EXPIRED);
    }
    throw new ApiError(401, INVALID_TOKEN);
  }
};

export const generateAccesstoken = (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_TIME_IN_MS
  });
};

export const generateRefreshtoken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_TIME_IN_MS
  });
};

export const generatePasswordResetToken = (payload) => {
  return jwt.sign(payload, env.PASSWORD_MANAGE_TOKEN_SECRET, {
    expiresIn: env.PASSWORD_MANAGE_TOKEN_TIME_IN_MS
  });
};

export const generateVerifyAccountToken = (payload) => {
  return jwt.sign(payload, env.EMAIL_VERIFICATION_TOKEN_SECRET, {
    expiresIn: env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS
  });
};

export const generatePwdSetupEmail = (payload) => {
  return jwt.sign(payload, env.PASSWORD_MANAGE_TOKEN_SECRET, {
    expiresIn: env.PASSWORD_MANAGE_TOKEN_TIME_IN_MS
  });
};

export const generateRandomHexToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateSHA256Hash = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateTokenAndHash = () => {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
};
