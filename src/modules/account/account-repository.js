const processDBRequest = require("../../utils/process-db-request");

const changePassword = async ({ userId, hashedPassword, schoolId, client }) => {
  const query = `
    UPDATE users
    SET password = $1
    WHERE id = $2 AND school_id = $3
  `;
  const queryParams = [hashedPassword, userId, schoolId];
  await processDBRequest({ query, queryParams, client });
};

const getStudentAccountDetail = async ({ userId, schoolId, roleId }) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.email,
      t1.has_system_access AS "hasSystemAccess",
      t3.name as "reporterName",
      t2.phone,
      t5.name AS class,
      t6.name AS section,
      t2.dob,
      t2.gender,
      t2.roll,
      t2.admission_date AS "admissionDate",
      t2.current_address AS "currentAddress",
      t2.permanent_address AS "permanentAddress",
      t2.father_name AS "fatherName",
      t2.father_phone AS "fatherPhone",
      t2.mother_name AS "motherName",
      t2.mother_phone AS "motherPhone",
      t2.guardian_name AS "guardianName",
      t2.guardian_phone AS "guardianPhone",
      t2.relation_of_guardian AS "relationOfGuardian",
      t4.name as "schoolName"
    FROM users t1
    LEFT JOIN user_profiles t2 ON t1.id = t2.user_id
    LEFT JOIN users t3 ON t1.reporter_id = t3.id
    LEFT JOIN schools t4 ON t1.school_id = t4.school_id
    LEFT JOIN classes t5 ON t5.id = t2.class_id
    LEFT JOIN sections t6 ON t6.id = t2.section_id
    WHERE t1.id = $1 AND t1.role_id = $2 AND t1.school_id = $3`;
  const queryParams = [userId, roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const getStaffAccountDetail = async ({ userId, roleId, schoolId }) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.email,
      t1.has_system_access AS "hasSystemAccess",
      t3.name as "reporterName",
      t2.phone,
      t2.dob,
      t2.gender,
      t2.join_date AS "joinDate",
      t2.marital_status as "maritalStatus",
      t2.qualification,
      t2.experience,
      t2.current_address AS "currentAddress",
      t2.permanent_address AS "permanentAddress",
      t2.father_name AS "fatherName",
      t2.mother_name AS "motherName",
      t2.emergency_phone AS "emergencyPhone",
      t4.name as "roleName",
      t5.name as "schoolName"
    FROM users t1
    LEFT JOIN user_profiles t2 ON t1.id = t2.user_id
    LEFT JOIN users t3 ON t1.reporter_id = t3.id
    LEFT JOIN roles t4 ON t4.id = t1.role_id
    LEFT JOIN schools t5 ON t1.school_id = t5.school_id
    WHERE t1.id = $1 AND t1.role_id = $2 AND t1.school_id = $3`;
  const queryParams = [userId, roleId, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

module.exports = {
  changePassword,
  getStudentAccountDetail,
  getStaffAccountDetail,
};
