import { env } from '../../config/index.js';
import { processDBRequest } from '../../utils/process-db-request.js';

export const insertRefreshToken = async ({ userId, refreshToken, schoolId }, client) => {
  const expiresAt = new Date(Date.now() + parseInt(env.JWT_REFRESH_TOKEN_TIME_IN_MS));
  const query = `
    INSERT INTO user_refresh_tokens (token, user_id, expires_at, school_id)
    VALUES($1, $2, $3, $4)`;
  const queryParams = [refreshToken, userId, expiresAt, schoolId];
  await processDBRequest({
    query,
    queryParams,
    client
  });
};
