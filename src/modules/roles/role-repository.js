const processDBRequest = require("../../utils/process-db-request");

const getRoleDetail = async (id) => {
  const query = "SELECT * FROM roles WHERE id = $1";
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const addRole = async (payload) => {
  const { name, schoolId } = payload;
  const STATIC_ROLE_ID = 10;
  const query = `
    INSERT INTO roles(name, school_id, static_role_id)
    VALUES($1, $2, $3)`;
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

const updateRole = async ({ id, name, schoolId }) => {
  const query = `
    UPDATE roles 
    SET name = $1
    WHERE id = $2
      AND is_editable = true
      AND school_id = $3
  `;
  const queryParams = [name, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateRoleStatus = async ({ id, status, schoolId }) => {
  const query = `
    UPDATE roles
    SET is_active = $1::boolean
    WHERE id = $2
      AND is_editable = true
      AND school_id = $3
  `;
  const queryParams = [status, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const assignPermissionsForRole = async (payload) => {
  const { schoolId, roleId, permissions } = payload;
  const query = `
    INSERT INTO role_permissions(school_id, role_id, permission_id, type)
    SELECT
      $1,
      $2,
      t1.id,
      t1.type
    FROM UNNEST($3::int[]) AS permission_id
    JOIN permissions t1 ON t1.id = permission_id
    ON CONFLICT(school_id, role_id, permission_id) DO NOTHING`;
  const queryParams = [schoolId, roleId, permissions];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deletePermissionsOfRole = async (payload) => {
  const { schoolId, roleId, permissions } = payload;
  const query = `
    DELETE FROM role_permissions
    WHERE school_id = $1
      AND role_id = $2
      AND permission_id = ANY($3::INT[])
  `;
  const queryParams = [schoolId, roleId, permissions];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getStaticRoleIdById = async (roleId) => {
  const query = `SELECT static_role_id FROM roles WHERE id = $1`;
  const queryParams = [roleId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0].static_role_id;
};

const getRolePermissions = async ({ roleId, staticRoleId, schoolId }) => {
  const isUserAdmin = staticRoleId === 2;

  const query = isUserAdmin
    ? `SELECT id, name FROM permissions WHERE direct_allowed_role_id = ANY($1)`
    : `
      SELECT
        t2.id,
        t2.name
      FROM role_permissions t1
      JOIN permissions t2 ON t2.id = t1.permission_id
      WHERE t1.role_id = $1 AND t1.school_id = $2
      AND t2.direct_allowed_role_id IN ('2', '12')
    `;
  const queryParams = isUserAdmin ? [[2, 12]] : [roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getRoleUsers = async (payload) => {
  const { roleId, schoolId } = payload;
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

const checkApiAccessOfRole = async (
  schoolId,
  roleId,
  apiPath,
  apiMethod,
  userId
) => {
  const query = `
    SELECT 1
    FROM role_permissions t1
    JOIN permissions t2 ON t2.id = t1.permission_id
    JOIN users t3 ON t3.id = $5
    WHERE t1.school_id = $1
      AND t1.role_id = $2
      AND t2.path = $3
      AND t2.method = $4
      AND t3.has_system_access = true
  `;
  const queryParams = [schoolId, roleId, apiPath, apiMethod, userId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  addRole,
  getRoles,
  getRoleDetail,
  updateRole,
  updateRoleStatus,
  getRolePermissions,
  getRoleUsers,
  assignPermissionsForRole,
  checkApiAccessOfRole,
  deletePermissionsOfRole,
  getStaticRoleIdById,
};
