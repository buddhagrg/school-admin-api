import { v4 as uuidV4 } from 'uuid';
import { env, db } from '../../config/index.js';
import {
  ApiError,
  generateHashedPassword,
  generateToken,
  generateCsrfHmacHash,
  verifyPassword
} from '../../utils/index.js';
import { changePassword } from './account-repository.js';
import { insertRefreshToken, findUserById } from '../../shared/repository/index.js';
import { DB_TXN } from '../../constants/index.js';

export const processPasswordChange = async (payload) => {
  const client = await db.connect();
  try {
    const { userId, currentPassword, newPassword, schoolId, roleName } = payload;
    await client.query(DB_TXN.BEGIN);
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }
    const { password: passwordFromDB } = user;
    await verifyPassword(passwordFromDB, currentPassword);
    const hashedPassword = await generateHashedPassword(newPassword);
    await changePassword({ userId, hashedPassword, schoolId, client });
    const csrfToken = uuidV4();
    const csrfHmacHash = generateCsrfHmacHash(csrfToken);
    const accessToken = generateToken(
      { id: userId, role: roleName, csrf_hmac: csrfHmacHash },
      env.JWT_ACCESS_TOKEN_SECRET,
      env.JWT_ACCESS_TOKEN_TIME_IN_MS
    );
    const refreshToken = generateToken(
      { id: userId },
      env.JWT_REFRESH_TOKEN_SECRET,
      env.JWT_REFRESH_TOKEN_TIME_IN_MS
    );
    await insertRefreshToken({ userId, refreshToken, schoolId, client });
    await client.query(DB_TXN.COMMIT);
    return {
      refreshToken,
      accessToken,
      csrfToken,
      message: 'Password changed successfully'
    };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    throw error;
  } finally {
    client.release();
  }
};
