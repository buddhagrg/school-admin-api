const processDBRequest = require("../../utils/process-db-request");

const contactUs = async (payload) => {
  const { name, email, message } = payload;
  const query = `
    INSERT INTO contact_messages(name, email, message)
    VALUES($1, $2, $3)
    `;
  const queryParams = [name, email, message];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getDashboardData = async (userId) => {
  const query = `SELECT * FROM get_dashboard_data($1)`;
  const queryParams = [userId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0].get_dashboard_data;
};

const getAllTeachersOfSchool = async (schoolId) => {
  const query = `
    SELECT t1.id, t1.name
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id AND t2.static_role_id = 3
    WHERE t1.school_id = $1 AND t1.has_system_access = TRUE
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

module.exports = { contactUs, getDashboardData, getAllTeachersOfSchool };
