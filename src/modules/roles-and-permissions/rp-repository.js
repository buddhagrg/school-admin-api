const { processDBRequest } = require("../../utils");

const getRoleDetail = async (id) => {
  const query = "SELECT * FROM roles WHERE id = $1";
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const insertRole = async ({ name, schoolId }) => {
  const STATIC_ROLE_ID = 10;
  const query =
    "INSERT INTO roles(name, school_id, static_role_id) VALUES($1, $2, $3)";
  const queryParams = [name, schoolId, STATIC_ROLE_ID];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getRoles = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      COUNT(t2.id) AS "usersAssociated",
      t1.is_active AS status
    FROM roles t1
    LEFT JOIN users t2 ON t2.role_id = t1.id
    WHERE t1.school_id = $1 AND t1.static_role_id != 1
    GROUP BY (t1.id, t1.name)
    ORDER BY t1.id, t1.name, t1.is_active
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const updateRoleById = async ({ id, name, schoolId }) => {
  const query =
    "UPDATE roles SET name = $1 WHERE id = $2 AND is_editable = true AND school_id = $3";
  const queryParams = [name, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const enableOrDisableRoleStatusByRoleId = async ({ id, status, schoolId }) => {
  const query =
    "UPDATE roles SET is_active = $1 WHERE id = $2 AND is_editable = true AND school_id = $3";
  const queryParams = [status, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAccessControlByIds = async ({ ids, client }) => {
  const query = `
    SELECT id, type
    FROM access_controls
    WHERE id = ANY($1::int[])
    AND direct_allowed_role_id IN (2, 12)
    `;
  const { rows } = await client.query(query, [ids]);
  return rows;
};

const insertPermissionForRoleId = async ({ queryParams, client }) => {
  const query = `
    INSERT INTO permissions(role_id, access_control_id, type, school_id)
    VALUES ${queryParams}
    ON CONFLICT (role_id, access_control_id, school_id) DO NOTHING`;
  await client.query(query);
};
const deletePermissionForRoleId = async ({ roleId, schoolId, client }) => {
  const query = "DELETE FROM permissions WHERE role_id = $1 AND school_id = $2";
  const queryParams = [roleId, schoolId];
  await client.query(query, queryParams);
};
const getStaticRoleIdById = async (roleId) => {
  const query = `SELECT static_role_id FROM roles WHERE id = $1`;
  const queryParams = [roleId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0].static_role_id;
};
const getPermissionsById = async ({ roleId, staticRoleId, schoolId }) => {
  const isUserAdmin = staticRoleId === 2;

  const query = isUserAdmin
    ? `SELECT id, name FROM access_controls WHERE direct_allowed_role_id = ANY($1)`
    : `
      SELECT
        ac.id,
        ac.name
      FROM permissions p
      JOIN access_controls ac ON p.access_control_id = ac.id
      WHERE p.role_id = $1 AND p.school_id = $2
      AND ac.direct_allowed_role_id IN ('2', '12')
    `;
  const queryParams = isUserAdmin ? [[2, 12]] : [roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getUsersByRoleId = async ({ roleId, schoolId }) => {
  const query = `
    SELECT
      id,
      name,
      last_login AS "lastLogin"
    FROM users
    WHERE role_id = $1 AND school_id = $2
  `;
  const queryParams = [roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const switchUserRole = async ({ userId, roleId, schoolId }) => {
  const query = `UPDATE users SET role_id = $1 WHERE id = $2 AND school_id = $3`;
  const queryParams = [roleId, userId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const checkPermission = async (roleId, apiPath, apiMethod) => {
  const query = `
    SELECT 1
    FROM permissions p
    JOIN access_controls ac ON p.access_control_id = ac.id
    WHERE p.role_id = $1 AND ac.path = $2 AND ac.method = $3
    `;
  const queryParams = [roleId, apiPath, apiMethod];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  insertRole,
  getRoles,
  getRoleDetail,
  updateRoleById,
  enableOrDisableRoleStatusByRoleId,
  getPermissionsById,
  getUsersByRoleId,
  getAccessControlByIds,
  insertPermissionForRoleId,
  switchUserRole,
  checkPermission,
  deletePermissionForRoleId,
  getStaticRoleIdById,
};
