const processDBRequest = require("../../utils/process-db-request");

const getStaff = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id
    WHERE t1.school_id = $1
      AND t2.static_role_id NOT IN (1,2,4,5)
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getStaffDetailById = async ({ id, schoolId }) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.has_system_access AS "hasSystemAccess",
      t1.role_id AS role,
      t4.name AS "roleName",
      t1.email,
      t1.reporter_id AS "reporterId",
      t2.name AS "reporterName",
      t3.gender,
      t3.marital_status AS "maritalStatus",
      t3.join_date AS "joinDate",
      t3.qualification,
      t3.experience,
      t3.dob,
      t3.phone,
      t3.father_name AS "fatherName",
      t3.mother_name AS "motherName",
      t3.emergency_phone AS "emergencyPhone",
      t3.current_address AS "currentAddress",
      t3.permanent_address AS "permanentAddress",
      t5.name as "schoolName"
    FROM users t1
    LEFT JOIN users t2 ON t2.id = t1.reporter_id
    LEFT JOIN user_profiles t3 ON t3.user_id = t1.id
    LEFT JOIN roles t4 ON t4.id = t1.role_id
    LEFT JOIN schools t5 ON t1.school_id = t5.school_id
    WHERE t1.id = $1 AND t1.school_id = $2`;
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const addOrUpdateStaff = async (payload) => {
  const query = `SELECT * FROM staff_add_update($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

module.exports = {
  getStaff,
  getStaffDetailById,
  addOrUpdateStaff,
};
