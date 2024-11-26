const { env } = require("../../config");
const processDBRequest = require("../../utils/process-db-request");

const insertRefreshToken = async ({
  userId,
  refreshToken,
  schoolId,
  client,
}) => {
  const expiresAt = new Date(
    Date.now() + parseInt(env.JWT_REFRESH_TOKEN_TIME_IN_MS)
  );
  const query = `
    INSERT INTO user_refresh_tokens (token, user_id, expires_at, school_id)
    VALUES($1, $2, $3, $4)`;
  const queryParams = [refreshToken, userId, expiresAt, schoolId];
  await processDBRequest({
    query,
    queryParams,
    client,
  });
};

module.exports = insertRefreshToken;
