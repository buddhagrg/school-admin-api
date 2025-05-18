import jwt from 'jsonwebtoken';
import { ApiError } from './api-error.js';

export const generateToken = (payload, secret, time) => {
  return jwt.sign(payload, secret, { expiresIn: time });
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(400, 'Token expired');
    }
    return null;
  }
};
