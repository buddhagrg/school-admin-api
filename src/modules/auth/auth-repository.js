const { db } = require("../../config");
const { processDBRequest } = require("../../utils");

const findUserByUsername = async ({ username, client }) => {
  const query = `
    SELECT
      t1.*,
      lower(t2.name) AS "roleName",
      t2.static_role_id AS "staticRoleId"
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id
    WHERE t1.email = $1`;
  const queryParams = [username];
  const { rows } = await client.query(query, queryParams);
  return rows[0];
};

const invalidateRefreshToken = async (refreshToken) => {
  const query = "DELETE FROM user_refresh_tokens WHERE token = $1";
  const queryParams = [refreshToken];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const findUserByRefreshToken = async (refreshToken) => {
  const query = `
    SELECT
      u.*,
      r.static_role_id AS "staticRoleId",
      r.name AS "roleName"
    FROM users u
    JOIN user_refresh_tokens rt ON rt.user_id = u.id
    JOIN roles r ON r.id = u.role_id
    WHERE rt.token = $1`;
  const queryParams = [refreshToken];
  const { rows } = await db.query(query, queryParams);
  return rows[0];
};

const updateUserRefreshToken = async (
  newRefreshToken,
  expiresAt,
  userId,
  oldRefreshToken
) => {
  const query = `
    UPDATE user_refresh_tokens
    SET token = $1, expires_at = $2
    WHERE user_id = $3 AND token = $4`;
  await db.query(query, [newRefreshToken, expiresAt, userId, oldRefreshToken]);
};

const getMenusByRoleId = async ({ staticRoleId, roleId, schoolId, client }) => {
  const directAllowedRoleId = Number(staticRoleId) === 2 ? [2, 12] : [1, 12];
  const isUserAdminOrSuperAdmin = [1, 2].includes(staticRoleId);

  const query = isUserAdminOrSuperAdmin
    ? `SELECT * FROM access_controls WHERE direct_allowed_role_id = ANY($1)`
    : `
      SELECT
        ac.id,
        ac.name,
        ac.path,
        ac.icon,
        ac.parent_path,
        ac.hierarchy_id,
        ac.type
      FROM permissions p
      JOIN access_controls ac ON p.access_control_id = ac.id
      WHERE p.role_id = $1 AND p.school_id = $2
      AND ac.direct_allowed_role_id IN (2, 12)`;
  const queryParams = isUserAdminOrSuperAdmin
    ? [directAllowedRoleId]
    : [roleId, schoolId];
  const { rows } = await client.query(query, queryParams);
  return rows;
};

const saveUserLastLoginDate = async ({ userId, client, schoolId }) => {
  const now = new Date();
  const query = `UPDATE users SET last_login = $1 WHERE id = $2 AND school_id = $3`;
  const queryParams = [now, userId, schoolId];
  await client.query(query, queryParams);
};

const deleteOldRefreshTokenByUserId = async ({ userId, client }) => {
  const query = `DELETE FROM user_refresh_tokens WHERE user_id = $1`;
  const queryParams = [userId];
  await client.query(query, queryParams);
};

const isEmailVerified = async (id) => {
  const query = "SELECT is_email_verified FROM users WHERE id = $1";
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0].is_email_verified;
};

const verifyAccountEmail = async (id) => {
  const query = `
    UPDATE users
      SET is_email_verified = true
    WHERE id = $1
    RETURNING *
  `;
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const doesEmailExist = async ({ userId, userEmail }) => {
  const query = `SELECT 1 FROM users WHERE email = $1 AND id = $2`;
  const queryParams = [userEmail, userId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const setupUserPassword = async (payload) => {
  const { userId, userEmail, password } = payload;
  const query = `
    UPDATE users
    SET password = $1, is_active = true
    WHERE id = $2 AND email = $3
  `;
  const queryParams = [password, userId, userEmail];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const setupSchoolProfile = async ({ payload, client }) => {
  const { name, email, phone, schoolId } = payload;
  const query = `INSERT INTO schools(name, email, phone, school_id) VALUES($1, $2, $3, $4) RETURNING *`;
  const queryParams = [name, email, phone, schoolId];
  const { rows } = await client.query(query, queryParams);
  return rows[0];
};

const checkIfSchoolExists = async ({ schoolId, client }) => {
  const query = `SELECT * FROM schools WHERE school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await client.query(query, queryParams);
  return rows[0];
};

const addAdminStaff = async ({ payload, client }) => {
  const query = `SELECT * FROM staff_add_update($1)`;
  const queryParams = [payload];
  const { rows } = await client.query(query, queryParams);
  return rows[0];
};

const updateSchoolUserId = async (payload) => {
  const { lastModifieddBy, schoolId, client } = payload;
  const query = `UPDATE schools SET last_modified_by = $1 WHERE school_id = $2`;
  const queryParams = [lastModifieddBy, schoolId];
  await client.query(query, queryParams);
};

const addStaticSchoolRoles = async ({ schoolId, client }) => {
  const query = `
    INSERT INTO roles(static_role_id, name, is_editable, school_id)
    VALUES
      (2, 'Admin', false, $1),
      (3, 'Teacher', false, $1),
      (4, 'Student', false, $1),
      (5, 'Parents', false, $1)
    RETURNING *
  `;
  const queryParams = [schoolId];
  const { rows } = await client.query(query, queryParams);
  return rows;
};

module.exports = {
  findUserByUsername,
  invalidateRefreshToken,
  findUserByRefreshToken,
  updateUserRefreshToken,
  getMenusByRoleId,
  saveUserLastLoginDate,
  deleteOldRefreshTokenByUserId,
  isEmailVerified,
  verifyAccountEmail,
  doesEmailExist,
  setupUserPassword,
  setupSchoolProfile,
  checkIfSchoolExists,
  addAdminStaff,
  addStaticSchoolRoles,
  updateSchoolUserId,
};
