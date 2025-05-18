import { processDBRequest } from '../../utils/process-db-request.js';

export const contactUs = async (payload) => {
  const { name, email, message } = payload;
  const query = `
    INSERT INTO contact_messages(name, email, message)
    VALUES($1, $2, $3)
    `;
  const queryParams = [name, email, message];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getDashboardData = async (payload) => {
  const { userId, staticRole, schoolId } = payload;
  const dashboard = {
    ADMIN: `SELECT * FROM get_admin_dashboard_data($1, $2) AS response`,
    TEACHER: `SELECT * FROM get_teacher_dashboard_data($1, $2) AS response`,
    STUDENT: `SELECT * FROM get_student_dashboard_data($1, $2) AS response`,
    ACCOUNTANT: `SELECT * FROM get_accountant_dashboard_data($1, $2) AS response`,
    HR: `SELECT * FROM get_hr_dashboard_data($1, $2) AS response`,
    DEFAULT: `SELECT * FROM get_dashboard_data($1, $2) AS response`
  };
  const query = dashboard[staticRole ?? DEFAULT];
  const queryParams = [schoolId, userId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0].response;
};

export const getAllTeachersOfSchool = async (schoolId) => {
  const query = `
    SELECT t1.id, t1.name
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id AND t2.static_role = 'TEACHER'
    WHERE t1.school_id = $1 AND t1.has_system_access = TRUE
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};
