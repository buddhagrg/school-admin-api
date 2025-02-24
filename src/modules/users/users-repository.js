const processDBRequest = require("../../utils/process-db-request");

const getUsers = async (payload) => {
  const { schoolId, roleId, name, sectionId, classId, roll } = payload;
  let query = `
    SELECT
      t1.id,
      t1.name,
      t1.email,
      t2.name AS "role",
      t2.static_role_id AS "staticRoleId",
      t1.last_login AS "lastLogin",
      t1.has_system_access AS "hasSystemAccess"
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id
    LEFT JOIN user_profiles t3 ON t3.user_id = t1.id AND t2.static_role_id = 3
    WHERE t2.static_role_id != 1 AND t1.school_id = $1
  `;
  let queryParams = [schoolId];
  if (roleId) {
    query += ` AND t1.role_id = $${queryParams.length + 1}`;
    queryParams.push(roleId);
  }
  if (name) {
    query += ` AND t1.name = $${queryParams.length + 1}`;
    queryParams.push(name);
  }
  if (classId) {
    query += ` AND t3.class_id = $${queryParams.length + 1}`;
    queryParams.push(classId);
  }
  if (sectionId) {
    query += ` AND t3.section_id = $${queryParams.length + 1}`;
    queryParams.push(sectionId);
  }
  if (roll) {
    query += ` AND t3.roll = $${queryParams.length + 1}`;
    queryParams.push(roll);
  }
  query += ` ORDER BY t1.name`;

  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const updateUserSystemAccess = async (payload) => {
  const { schoolId, hasSystemAccess, userId, reviewerId } = payload;
  const now = new Date();
  const query = `
    UPDATE users
    SET
      has_system_access = $1,
      status_last_reviewer_id = $2,
      status_last_reviewed_date = $3
    WHERE school_id = $4 AND id = $5
  `;
  const queryParams = [hasSystemAccess, reviewerId, now, schoolId, userId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const switchUserRole = async (payload) => {
  const { userId, roleId, schoolId } = payload;
  const query = `UPDATE users SET role_id = $1 WHERE id = $2 AND school_id = $3`;
  const queryParams = [roleId, userId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = { getUsers, updateUserSystemAccess, switchUserRole };
