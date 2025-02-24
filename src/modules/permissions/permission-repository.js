const processDBRequest = require("../../utils/process-db-request");

const getAllPermissions = async (staticRoleId) => {
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
      direct_allowed_role_id AS "directAllowedRoleId"
    FROM permissions
    WHERE 1=1
  `;
  const param =
    Number(staticRoleId) === 2
      ? `AND direct_allowed_role_id = ANY(ARRAY ['2', '12'])`
      : "";
  const query = `${getQuery} ${param}`;
  const { rows } = await processDBRequest({ query });
  return rows;
};

const getMyPermissions = async ({ staticRoleId, roleId, schoolId }) => {
  const directAllowedRoleId = Number(staticRoleId) === 2 ? [2, 12] : [1, 12];
  const isUserAdminOrSuperAdmin = [1, 2].includes(staticRoleId);

  const query = isUserAdminOrSuperAdmin
    ? `SELECT * FROM permissions WHERE direct_allowed_role_id = ANY($1)`
    : `
      SELECT t2.*
      FROM role_permissions t1
      JOIN permissions t2 ON t2.id = t1.permission_id
      WHERE t1.role_id = $1 AND t1.school_id = $2`;

  const queryParams = isUserAdminOrSuperAdmin
    ? [directAllowedRoleId]
    : [roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addPermission = async (payload) => {
  const { name, path, type, method, hierarchy_id, id, directAllowedRoleId } =
    payload;
  const query = `
    WITH query_result AS (SELECT path FROM permissions WHERE id = $1)
    INSERT INTO permissions (name, path, parent_path, hierarchy_id, type, method, direct_allowed_role_id)
    VALUES ($2, $3, COALESCE((SELECT path FROM query_result), NULL), $4, $5, $6, $7)
  `;
  const queryParams = [
    id,
    name,
    path,
    hierarchy_id,
    type,
    method,
    directAllowedRoleId || null,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updatePermission = async (payload) => {
  const { id, name, path, hierarchy_id, type, method, directAllowedRoleId } =
    payload;
  const query = `
    UPDATE permissions
    SET
      name = $1,
      path = $2,
      hierarchy_id = $3,
      type = $4,
      method = $5,
      direct_allowed_role_id = $6
    WHERE id = $7
    `;
  const queryParams = [
    name,
    path,
    hierarchy_id,
    type,
    method,
    directAllowedRoleId || null,
    id,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deletePermission = async (id) => {
  const query = `DELETE FROM permissions WHERE id = $1`;
  const queryParams = [id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getAllPermissions,
  getMyPermissions,
  addPermission,
  updatePermission,
  deletePermission,
};
