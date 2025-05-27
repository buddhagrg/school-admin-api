import { v4 as uuidV4 } from 'uuid';
import {
  ApiError,
  generateHashedPassword,
  generateCsrfHmacHash,
  verifyPassword,
  generateAccesstoken,
  generateRefreshtoken,
  withTransaction
} from '../../utils/index.js';
import { changePassword } from './account-repository.js';
import { insertRefreshToken, findUserById } from '../../shared/repository/index.js';
import { ACCOUNT_MESSAGES } from './account-messages.js';
import { ERROR_MESSAGES } from '../../constants/error-messages.js';

export const processPasswordChange = async (payload) => {
  if (payload.userId === 2) {
    throw new ApiError(500, ERROR_MESSAGES.DISABLED_IN_DEMO_ACCOUNT);
  }

  return withTransaction(async (client) => {
    const { userId, currentPassword, newPassword, schoolId, roleName } = payload;

    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, ACCOUNT_MESSAGES.USER_DOES_NOT_EXIST);
    }

    const { password: passwordFromDB } = user;
    await verifyPassword(passwordFromDB, currentPassword);
    const hashedPassword = await generateHashedPassword(newPassword);
    await changePassword({ userId, hashedPassword, schoolId }, client);

    const csrfToken = uuidV4();
    const csrfHmacHash = generateCsrfHmacHash(csrfToken);
    const accessToken = generateAccesstoken({
      userId,
      role: roleName,
      csrf_hmac: csrfHmacHash
    });
    const refreshToken = generateRefreshtoken({ userId });
    await insertRefreshToken({ userId, refreshToken, schoolId }, client);

    return {
      refreshToken,
      accessToken,
      csrfToken,
      message: ACCOUNT_MESSAGES.PWD_CHANGE_SUCCESS
    };
  }, ACCOUNT_MESSAGES.PWD_CHANGE_FAIL);
};
