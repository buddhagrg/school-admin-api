import { processDBRequest } from '../../utils/process-db-request.js';

export const getAllPermissions = async (staticRole) => {
  const getQuery = `
    SELECT
      id,
      name,
      path,
      icon,
      method,
      parent_path,
      hierarchy_id,
      type,
      direct_allowed_role AS "directAllowedRole"
    FROM permissions
    WHERE 1=1
  `;
  const param =
    staticRole === 'ADMIN'
      ? `AND direct_allowed_role = ANY(ARRAY ['ADMIN', 'SYSTEM_ADMIN_AND_ADMIN'])`
      : '';
  const query = `${getQuery} ${param}`;
  const { rows } = await processDBRequest({ query });
  return rows;
};

export const getMyPermissions = async ({ staticRole, roleId, schoolId }) => {
  const directAllowedRole =
    staticRole === 'ADMIN'
      ? ['ADMIN', "'SYSTEM_ADMIN_AND_ADMIN'"]
      : ['SYSTEM_ADMIN', "'SYSTEM_ADMIN_AND_ADMIN'"];
  const isUserAdminOrSuperAdmin = ['SYSTEM_ADMIN', 'ADMIN'].includes(staticRole);
  const query = isUserAdminOrSuperAdmin
    ? `SELECT * FROM permissions WHERE direct_allowed_role = ANY($1)`
    : `
      SELECT t2.*
      FROM role_permissions t1
      JOIN permissions t2 ON t2.id = t1.permission_id
      WHERE t1.role_id = $1 AND t1.school_id = $2`;
  const queryParams = isUserAdminOrSuperAdmin ? [directAllowedRole] : [roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const addPermission = async (payload) => {
  const { name, path, type, method, hierarchy_id, id, directAllowedRole } = payload;
  const query = `
    WITH query_result AS (SELECT path FROM permissions WHERE id = $1)
    INSERT INTO permissions (name, path, parent_path, hierarchy_id, type, method, direct_allowed_role)
    VALUES ($2, $3, COALESCE((SELECT path FROM query_result), NULL), $4, $5, $6, $7)
  `;
  const queryParams = [id, name, path, hierarchy_id, type, method, directAllowedRole || null];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updatePermission = async (payload) => {
  const { id, name, path, hierarchy_id, type, method, directAllowedRole } = payload;
  const query = `
    UPDATE permissions
    SET
      name = $1,
      path = $2,
      hierarchy_id = $3,
      type = $4,
      method = $5,
      direct_allowed_role = $6
    WHERE id = $7
    `;
  const queryParams = [name, path, hierarchy_id, type, method, directAllowedRole || null, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const deletePermission = async (id) => {
  const query = `DELETE FROM permissions WHERE id = $1`;
  const queryParams = [id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};
