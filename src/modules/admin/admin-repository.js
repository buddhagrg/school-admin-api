const processDBRequest = require("../../utils/process-db-request");

const getSchoolCommonQuery = `
  SELECT
    t1.school_id AS "schoolId",
    t1.name,
    t1.email,
    t1.phone,
    t2.name as "lastModifiedByName",
    t1.created_dt AS "createdDt",
    t1.updated_dt AS "updatedDt",
    t1.is_active AS "isActive",
    t1.is_email_verified AS "isEmailVerified"
  FROM schools t1
  LEFT JOIN users t2 ON t2.id = t1.last_modified_by
  WHERE 1=1
`;

const addSchool = async (payload) => {
  const { name, email, phone, schoolId, userId } = payload;
  const query = `INSERT INTO schools(name, email, phone, school_id, last_modified_by) VALUES($1, $2, $3, $4, $5)`;
  const queryParams = [name, email, phone, schoolId, userId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAllSchools = async () => {
  const query = getSchoolCommonQuery;
  const { rows } = await processDBRequest({ query });
  return rows;
};

const getSchool = async (schoolId) => {
  const query = `${getSchoolCommonQuery} AND t1.school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateSchool = async (payload) => {
  const now = new Date();
  const { name, email, phone, schoolId, userId } = payload;
  const query = `
    UPDATE schools
    SET
        name = $1,
        email = $2,
        phone = $3,
        last_modified_by = $4,
        updated_dt = $5
    WHERE school_id = $6
    `;
  const queryParams = [name, email, phone, userId, now, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteSchool = async (schoolId) => {
  const query = `DELETE FROM schools WHERE school_id = $1`;
  const queryParams = [schoolId];
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
  addSchool,
  getAllSchools,
  deleteSchool,
  updateSchool,
  addAccessControl,
  updateAccessControl,
  deleteAccessControl,
  getSchool,
};
