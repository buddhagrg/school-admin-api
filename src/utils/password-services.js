import * as argon2 from 'argon2';
import { ApiError } from './api-error.js';

export const generateHashedPassword = async (password) => {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
};

export const verifyPassword = async (passwordFromDb, passwordFromUser) => {
  const isPasswordValid = await argon2.verify(passwordFromDb, passwordFromUser);
  if (!isPasswordValid) {
    throw new ApiError(400, 'Invalid credential');
  }
};
