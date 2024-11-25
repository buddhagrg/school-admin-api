const { processDBRequest } = require("../../utils");

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

module.exports = {
  getAllAccessControls,
  getMyAccessControl,
};
