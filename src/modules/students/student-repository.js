import { processDBRequest } from '../../utils/process-db-request.js';

export const getStudents = async (payload) => {
  const { schoolId, name, sectionId, classId } = payload;
  let query = `
    SELECT
      t1.id,
      t1.user_code AS "studentId",
      t1.name,
      t4.name AS class,
      t5.name AS section,
      t6.name AS gender,
      t1.has_system_access AS "hasSystemAccess"
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id AND t2.static_role = 'STUDENT'
    JOIN user_profiles t3 ON t3.user_id = t1.id
    JOIN classes t4 ON t4.id = t3.class_id
    LEFT JOIN sections t5 ON t5.id = t3.section_id
    JOIN genders t6 ON t6.code = t3.gender
    WHERE t1.school_id = $1
  `;
  let queryParams = [schoolId];
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
  query += ` ORDER BY t1.name`;
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const addOrUpdateStudent = async (payload) => {
  const query = 'SELECT * FROM student_add_update($1)';
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const getStudentDetailForEdit = async (payload) => {
  const { userId, schoolId } = payload;
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.email,
      t1.has_system_access AS "hasSystemAccess",
      t2.phone,
      t2.gender,
      t2.dob,
      t2.class_id AS "classId",
      t2.section_id AS "sectionId",
      t2.roll,
      t2.guardian_name AS "guardianName",
      t2.guardian_phone AS "guardianPhone",
      t2.guardian_email AS "guardianEmail",
      NULL AS "guardianRelationship",
      t2.current_address AS "currentAddress",
      t2.permanent_address AS "permanentAddress",
      t2.join_date AS "admissionDate",
      t2.blood_group AS "bloodGroup"
    FROM users t1
    JOIN user_profiles t2 ON t2.user_id = t1.id
    WHERE t1.school_id = $1 AND t1.id = $2`;
  const queryParams = [schoolId, userId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const getStudentDetailForView = async (payload) => {
  const { userId, schoolId } = payload;
  const query = `
    SELECT
      t1.id,
      t1.user_code AS "studentId",
      t1.name,
      t1.email,
      t1.last_login AS "lastLogin",
      t1.password_last_changed_date AS "passwordLastChangedDate",
      t1.recent_device_info AS "recentDeviceInfo",
      t1.is_email_verified AS "isEmailVerified",
      t1.has_system_access AS "hasSystemAccess",
      t3.name AS gender,
      t2.join_date AS "admissionDate",
      t2.dob,
      t2.phone,
      t4.name AS class,
      t5.name AS section,
      t2.roll,
      t2.guardian_name AS "guardianName",
      t2.guardian_phone AS "guardianPhone",
      t2.guardian_email AS "guardianEmail",
      t2.guardian_relationship AS "guardianRelationship",
      t2.current_address AS "currentAddress",
      t2.permanent_address AS "permanentAddress",
      t2.blood_group AS "bloodGroup"
    FROM users t1
    JOIN user_profiles t2 ON t2.user_id = t1.id
    JOIN genders t3 ON t3.code = t2.gender
    JOIN classes t4 ON t4.id = t2.class_id
    LEFT JOIN sections t5 ON t5.id = t2.section_id
    WHERE t1.school_id = $1 AND t1.id = $2
  `;
  const queryParams = [schoolId, userId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const getStudentDueFees = async (payload) => {
  const { schoolId, studentId, academicyearId } = payload;
  const query = `
  SELECT
    t1.*,
    t2.name AS "statusDescription",
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'name', t6.name,
        'description', t3.description,
        'amount', t3.amount,
        'quantity', t3.quantity,
        'totalAmount', t3.total_amount,
        'totalDiscount', t3.total_discount,
        'createdDate', t3.created_date,
        'updatedDate', t3.updated_date
      )
    ) AS items
  FROM invoices t1
  JOIN invoice_status t2 ON t2.code = t1.invoice_status_code
  JOIN invoice_items t3 ON t3.invoice_id = t1.id
  JOIN student_fees t4 ON t4.id = t3.student_fee_id
  JOIN fees_structures t5 ON t5.id = t4.fee_structure_id
  JOIN fees t6 ON t6.id = t5.fee_id
  WHERE t1.school_id = $1
    AND t1.user_id = $3
    AND t1.academic_year_id = $2
    AND t1.invoice_status_code IN ('PARTIALLY_PAID', 'ISSUED')
  `;
  const queryParams = [schoolId, studentId, academicyearId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};
