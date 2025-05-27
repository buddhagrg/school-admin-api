import { processDBRequest } from '../../utils/process-db-request.js';

export const getAllStaff = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.user_code AS "staffId",
      t1.name,
      t2.name AS role,
      t1.email,
      t1.has_system_access AS "hasSystemAccess",
      t4.name AS department
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id
    LEFT JOIN user_profiles t3 ON t3.user_id = t1.id
    LEFT JOIN departments t4 ON t4.id = t3.department_id
    WHERE t1.school_id = $1
      AND t2.static_role NOT IN ('STUDENT')
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const getStaffDetailForView = async ({ userId, schoolId }) => {
  const query = `
    SELECT
      t1.id,
      t1.user_code AS "staffId",
      t1.name,
      t1.email,
      t1.last_login AS "lastLogin",
      t1.password_last_changed_date AS "passwordLastChangedDate",
      t1.recent_device_info AS "recentDeviceInfo",
      t1.is_email_verified AS "isEmailVerified",
      t1.has_system_access AS "hasSystemAccess",
      t3.name AS role,
      t2.phone,
      t6.name AS gender,
      t2.join_date AS "joinDate",
      t2.dob,
      t2.qualification,
      t2.experience,
      t5.name AS department,
      t4.name AS "maritalStatus",
      t2.blood_group AS "bloodGroup",
      t2.guardian_name AS "guardianName",
      t2.guardian_email AS "guardianEmail",
      t2.guardian_phone AS "guardianPhone",
      t2.guardian_relationship AS "guardianRelationship",
      t2.current_address AS "currentAddress",
      t2.permanent_address AS "permanentAddress"
    FROM users t1
    LEFT JOIN user_profiles t2 ON t2.user_id = t1.id
    JOIN roles t3 ON t3.id = t1.role_id
    LEFT JOIN marital_status t4 ON t4.code = t2.marital_status
    LEFT JOIN departments t5 ON t5.id = t2.department_id
    LEFT JOIN genders t6 ON t6.code = t2.gender
    WHERE t1.school_id = $1 AND t1.id = $2`;
  const queryParams = [schoolId, userId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const getStaffDetailForEdit = async ({ userId, schoolId }) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.email,
      t1.has_system_access AS "hasSystemAccess",
      t1.role_id AS "roleId",
      t2.phone,
      t2.gender,
      t2.join_date AS "joinDate",
      t2.dob,
      t2.qualification,
      t2.experience,
      t2.department_id AS "departmentId",
      t2.marital_status AS "maritalStatus",
      t2.blood_group AS "bloodGroup",
      t2.guardian_name AS "guardianName",
      t2.guardian_email AS "guardianEmail",
      t2.guardian_phone AS "guardianPhone",
      t2.guardian_relationship AS "guardianRelationship",
      t2.current_address AS "currentAddress",
      t2.permanent_address AS "permanentAddress"
    FROM users t1
    LEFT JOIN user_profiles t2 ON t2.user_id = t1.id
    WHERE t1.school_id = $1 AND t1.id = $2`;
  const queryParams = [schoolId, userId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const addOrUpdateStaff = async (payload, client) => {
  const query = `SELECT * FROM staff_add_update($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0];
};
