import { processDBRequest } from '../../utils/process-db-request.js';

export const findUserByEmail = async ({ email, client }) => {
  const query = `
    SELECT
      t1.id AS "userId",
      t1.role_id AS "roleId",
      t1.name,
      t1.email,
      t1.password AS "passwordFromDB",
      t1.has_system_access AS "hasSystemAccess",
      t1.school_id AS "schoolId",
      lower(t2.name) AS "roleName",
      t2.static_role AS "staticRole",
      t3.is_active AS "isSchoolActive"
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id
    JOIN schools t3 ON t3.school_id = t1.school_id
    WHERE t1.email = $1`;
  const queryParams = [email];
  const { rows } = await processDBRequest({
    query,
    queryParams,
    client
  });
  return rows[0];
};

export const invalidateRefreshToken = async (refreshToken) => {
  const query = 'DELETE FROM user_refresh_tokens WHERE token = $1';
  const queryParams = [refreshToken];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const findUserByRefreshToken = async (refreshToken) => {
  const query = `
    SELECT
      u.*,
      r.static_role AS "staticRole",
      r.name AS "roleName"
    FROM users u
    JOIN user_refresh_tokens rt ON rt.user_id = u.id
    JOIN roles r ON r.id = u.role_id
    WHERE rt.token = $1`;
  const queryParams = [refreshToken];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const updateUserRefreshToken = async (
  newRefreshToken,
  expiresAt,
  userId,
  oldRefreshToken
) => {
  const query = `
    UPDATE user_refresh_tokens
    SET token = $1, expires_at = $2
    WHERE user_id = $3 AND token = $4`;
  const queryParams = [newRefreshToken, expiresAt, userId, oldRefreshToken];
  await processDBRequest({ query, queryParams });
};

export const getMenusByRoleId = async ({ staticRole, roleId, schoolId, client }) => {
  const directAllowedRole =
    staticRole === 'ADMIN'
      ? ['ADMIN', 'SYSTEM_ADMIN_AND_ADMIN']
      : ['SYSTEM_ADMIN', 'SYSTEM_ADMIN_AND_ADMIN'];
  const isUserAdminOrSuperAdmin = ['SYSTEM_ADMIN', 'ADMIN'].includes(staticRole);
  const query = isUserAdminOrSuperAdmin
    ? `SELECT * FROM permissions WHERE direct_allowed_role = ANY($1)`
    : `
      SELECT
        t2.id,
        t2.name,
        t2.path,
        t2.icon,
        t2.parent_path,
        t2.hierarchy_id,
        t2.type
      FROM role_permissions t1
      JOIN permissions t2 ON t2.id = t1.permission_id
      WHERE t1.role_id = $1 AND t1.school_id = $2
      AND t2.direct_allowed_role IN ('ADMIN', 'SYSTEM_ADMIN_AND_ADMIN')`;
  const queryParams = isUserAdminOrSuperAdmin ? [directAllowedRole] : [roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows;
};

export const saveUserLastLoginDetail = async ({ userId, client, schoolId, recentDeviceInfo }) => {
  const now = new Date();
  const query = `
    UPDATE users
    SET
      last_login = $1,
      recent_device_info = $2
    WHERE school_id = $3 AND id = $4
  `;
  const queryParams = [now, recentDeviceInfo, schoolId, userId];
  await processDBRequest({
    query,
    queryParams,
    client
  });
};

export const deleteOldRefreshTokenByUserId = async ({ userId, client }) => {
  const query = `DELETE FROM user_refresh_tokens WHERE user_id = $1`;
  const queryParams = [userId];
  await processDBRequest({
    query,
    queryParams,
    client
  });
};

export const verifyAccountEmail = async (id) => {
  const query = `
    UPDATE users SET is_email_verified = true
    WHERE id = $1
    RETURNING *
  `;
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const setupPassword = async (payload) => {
  const { demoId, hashedPassword } = payload;
  const query = `SELECT * FROM setup_school_and_user($1, $2)`;
  const queryParams = [demoId, hashedPassword];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};
