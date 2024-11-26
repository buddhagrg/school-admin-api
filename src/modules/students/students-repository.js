const processDBRequest = require("../../utils/process-db-request");

const findAllStudents = async (payload) => {
  const { name, className, section, roll, schoolId } = payload;
  let query = `
    SELECT
      t1.id,
      t1.name,
      t1.email,
      t1.last_login AS "lastLogin",
      t1.is_active AS "systemAccess"
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id
    WHERE t2.static_role_id = 4 AND t1.school_id = $1`;
  let queryParams = [schoolId];
  if (name) {
    query += ` AND t1.name = $${queryParams.length + 1}`;
    queryParams.push(name);
  }
  if (className) {
    query += ` AND t3.class_name = $${queryParams.length + 1}`;
    queryParams.push(className);
  }
  if (section) {
    query += ` AND t3.section_name = $${queryParams.length + 1}`;
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
      p.class_name AS "class",
      p.section_name AS "section",
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
      p.admission_dt AS "admissionDate",
      r.name as "reporterName",
      s.name as "schoolName"
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    LEFT JOIN users r ON u.reporter_id = r.id
    LEFT JOIN schools s ON u.school_id = s.school_id
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
      status_last_reviewed_dt = $2,
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
      updated_dt = $3
    WHERE id = $4;
  `;
  const queryParams = [name, email, currentDate, id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

module.exports = {
  findAllStudents,
  addOrUpdateStudent,
  findStudentDetail,
  findStudentToSetStatus,
  findStudentToUpdate,
};
