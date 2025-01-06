const processDBRequest = require("../../utils/process-db-request");

const getAllAccessControls = async (staticRoleId) => {
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
    FROM access_controls
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

const getMyAccessControl = async ({ staticRoleId, roleId, schoolId }) => {
  const directAllowedRoleId = Number(staticRoleId) === 2 ? [2, 12] : [1, 12];
  const isUserAdminOrSuperAdmin = [1, 2].includes(staticRoleId);

  const query = isUserAdminOrSuperAdmin
    ? `SELECT * FROM access_controls WHERE direct_allowed_role_id = ANY($1)`
    : `
      SELECT ac.*
      FROM permissions p
      JOIN access_controls ac ON p.access_control_id = ac.id
      WHERE p.role_id = $1 AND p.school_id = $2`;

  const queryParams = isUserAdminOrSuperAdmin
    ? [directAllowedRoleId]
    : [roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addAccessControl = async (payload) => {
  const { name, path, type, method, hierarchy_id, id, directAllowedRoleId } =
    payload;
  const query = `
    WITH query_result AS (
        SELECT path FROM access_controls WHERE id = $1
    )
    INSERT INTO access_controls (name, path, parent_path, hierarchy_id, type, method, direct_allowed_role_id)
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

const updateAccessControl = async (payload) => {
  const { id, name, path, hierarchy_id, type, method, directAllowedRoleId } =
    payload;
  const query = `
    UPDATE access_controls
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

const deleteAccessControl = async (id) => {
  const query = `DELETE FROM access_controls WHERE id = $1`;
  const queryParams = [id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getAllAccessControls,
  getMyAccessControl,
  addAccessControl,
  updateAccessControl,
  deleteAccessControl,
};
