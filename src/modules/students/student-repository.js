const processDBRequest = require("../../utils/process-db-request");

const findAllStudents = async (payload) => {
  const { name, classId, section, roll, schoolId } = payload;
  let query = `
    SELECT
      t1.id,
      t1.name,
      t1.email,
      t1.last_login AS "lastLogin",
      t1.is_active AS "systemAccess"
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id
    LEFT JOIN user_profiles t3 ON t3.user_id = t1.id
    WHERE t2.static_role_id = 4 AND t1.school_id = $1`;
  let queryParams = [schoolId];
  if (name) {
    query += ` AND t1.name = $${queryParams.length + 1}`;
    queryParams.push(name);
  }
  if (classId) {
    query += ` AND t3.class_id = $${queryParams.length + 1}`;
    queryParams.push(classId);
  }
  if (section) {
    query += ` AND t3.section_id = $${queryParams.length + 1}`;
    queryParams.push(section);
  }
  if (roll) {
    query += ` AND t3.roll = $${queryParams.length + 1}`;
    queryParams.push(roll);
  }

  query += " ORDER BY t1.id";

  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addOrUpdateStudent = async (payload) => {
  const query = "SELECT * FROM student_add_update($1)";
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const findStudentDetail = async ({ id, schoolId }) => {
  const query = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.is_active AS "systemAccess",
      p.phone,
      p.gender,
      p.dob,
      c.name AS class,
      sec.name AS section,
      p.roll,
      p.father_name AS "fatherName",
      p.father_phone AS "fatherPhone",
      p.mother_name AS "motherName",
      p.mother_phone AS "motherPhone",
      p.guardian_name AS "guardianName",
      p.guardian_phone AS "guardianPhone",
      p.relation_of_guardian as "relationOfGuardian",
      p.current_address AS "currentAddress",
      p.permanent_address AS "permanentAddress",
      p.admission_date AS "admissionDate",
      r.name as "reporterName",
      s.name as "schoolName"
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    LEFT JOIN users r ON u.reporter_id = r.id
    LEFT JOIN schools s ON u.school_id = s.school_id
    LEFT JOIN classes c ON c.id = p.class_id
    LEFT JOIN sections sec ON sec.id = p.section_id
    WHERE u.id = $1 AND u.school_id = $2`;
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const findStudentToSetStatus = async ({
  userId,
  reviewerId,
  status,
  schoolId,
}) => {
  const now = new Date();
  const query = `
    UPDATE users
    SET
      is_active = $1,
      status_last_reviewed_date = $2,
      status_last_reviewer_id = $3
    WHERE id = $4 AND school_id = $5
  `;
  const queryParams = [status, now, reviewerId, userId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const findStudentToUpdate = async (paylaod) => {
  const {
    basicDetails: { name, email },
    id,
  } = paylaod;
  const currentDate = new Date();
  const query = `
    UPDATE users
    SET
      name = $1,
      email = $2,
      updated_date = $3
    WHERE id = $4;
  `;
  const queryParams = [name, email, currentDate, id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getStudentDueFees = async (payload) => {
  const { schoolId, studentId, academicyearId } = payload;
  const query = `
  SELECT
    t1.*,
    t2.description AS "statusDescription",
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
  JOIN invoice_status t2 ON t2.code = t1.status
  JOIN invoice_items t3 ON t3.invoice_id = t1.id
  JOIN student_fees t4 ON t4.id = t3.student_fee_id
  JOIN fees_structures t5 ON t5.id = t4.fee_structure_id
  JOIN fees t6 ON t6.id = t5.fee_id
  WHERE school_id = $1
    AND user_id = $3
    AND academic_year_id = $2
    AND status IN ('PARTIALLY_PAID', 'ISSUED')
  `;
  const queryParams = [schoolId, studentId, academicyearId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

module.exports = {
  findAllStudents,
  addOrUpdateStudent,
  findStudentDetail,
  findStudentToSetStatus,
  findStudentToUpdate,
  getStudentDueFees,
};
