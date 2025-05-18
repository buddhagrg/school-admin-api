import { processDBRequest } from '../../utils/process-db-request.js';

export const getRoleDetail = async (id) => {
  const query = 'SELECT * FROM roles WHERE id = $1';
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const addRole = async (payload) => {
  const { name, schoolId } = payload;
  const STATIC_ROLE = 'STAFF';
  const query = `
    INSERT INTO roles(name, school_id, static_role)
    VALUES($1, $2, $3)`;
  const queryParams = [name, schoolId, STATIC_ROLE];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getRoles = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      COUNT(t2.id) AS "usersAssociated",
      t1.is_active AS status,
      t1.static_role AS "staticRole",
      t1.is_editable AS "isEditable"
    FROM roles t1
    LEFT JOIN users t2 ON t2.role_id = t1.id
    WHERE t1.school_id = $1
    GROUP BY (t1.id, t1.name)
    ORDER BY t1.id, t1.name, t1.is_active
`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const updateRole = async ({ id, name, schoolId, status }) => {
  const query = `
    UPDATE roles 
    SET name = $1, is_active = $2
    WHERE is_editable = true
      AND school_id = $3
      AND id = $4
  `;
  const queryParams = [name, status, schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateRoleStatus = async ({ id, status, schoolId }) => {
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

export const saveRolePermissions = async (payload) => {
  const { schoolId, roleId, permissions } = payload;
  const query = `SELECT * FROM save_role_permissions($1, $2, $3)`;
  const queryParams = [schoolId, roleId, JSON.stringify(permissions)];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const getRolePermissions = async (payload) => {
  const { roleId, schoolId } = payload;
  const query = `
    SELECT
      t2.id,
      t2.name
    FROM role_permissions t1
    JOIN permissions t2 ON t2.id = t1.permission_id
    WHERE t1.role_id = $1 AND t1.school_id = $2
  `;
  const queryParams = [roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const getRoleUsers = async (payload) => {
  const { roleId, schoolId } = payload;
  const query = `
    SELECT
      id,
      name,
      email
    FROM users
    WHERE role_id = $1 AND school_id = $2
  `;
  const queryParams = [roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const checkApiAccessOfRole = async (schoolId, roleId, apiPath, apiMethod, userId) => {
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
