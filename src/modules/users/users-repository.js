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
      t1.is_active AS "systemAccess"
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

  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

module.exports = { getUsers };
