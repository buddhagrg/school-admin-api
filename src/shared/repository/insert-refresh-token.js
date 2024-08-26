const { env } = require("../../config");

const insertRefreshToken = async ({ userId, refreshToken }, client) => {
    const expiresAt = new Date(Date.now() + parseInt(env.jwtRefreshTokenTimeInMS));
    const query = `INSERT INTO user_refresh_tokens (token, user_id, expires_at) VALUES($1, $2, $3)`;
    const queryParams = [refreshToken, userId, expiresAt];
    await client.query(query, queryParams);
};

module.exports = { insertRefreshToken };