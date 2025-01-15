const processDBRequest = require("../../utils/process-db-request");

const getClassTeachers = async (schoolId) => {
  const query = `
    SELECT
      t2.name as class,
      CASE WHEN t1.section_id IS NULL THEN
        JSON_BUILD_OBJECT(
          'id', t1.teacher_id,
          'name', t4.name
        )
      ELSE
        NULL
      END AS teacher,
      CASE WHEN t1.section_id IS NOT NULL THEN
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', t1.section_id,
            'name', t3.name,
            'teacherId', t1.teacher_id
          )
        )
      ELSE
        '[]' 
      END AS sections
    FROM class_teachers t1
    JOIN classes t2 ON t2.id = t1.class_id
    LEFT JOIN sections t3 ON t3.id = t1.section_id
    JOIN USERS t4 ON t4.id = t1.teacher_id
    WHERE t1.school_id = $1
    GROUP BY t2.name, t1.section_id, t1.teacher_id, t4.name
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addClassTeacher = async (payload) => {
  const { classId, section, teacher, schoolId } = payload;
  const query = `
    INSERT INTO class_teachers (school_id, class_id, section_id, teacher_id)
    VALUES($1, $2, $3, $4)
  `;
  const queryParams = [schoolId, classId, section, teacher];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getClassTeacherById = async ({ id, schoolId }) => {
  const query = `
    SELECT
      t1.id,
      t4.name AS class,
      t5.name AS section,
      t2.name AS teacher
    FROM class_teachers t1
    JOIN users t2 ON t2.id = t1.teacher_id
    JOIN user_profiles t3 ON t3.user_id = t2.id
    JOIN classes t4 ON t4.id = t3.class_id
    JOIN sections t5 ON t5.id = t3.section_id
    WHERE id = $1 AND school_id = $2
  `;
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({
    query,
    queryParams,
  });
  return rows[0];
};

const updateClassTeacherById = async (payload) => {
  const { id, classId, section, teacher, schoolId } = payload;
  const query = `
    UPDATE class_teachers
    SET
      class_id = $1,
      section_id = $2,
      teacher_id = $3
    WHERE id = $4 AND school_id = $5
  `;
  const queryParams = [classId, section, teacher, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const findAllTeachers = async (schoolId) => {
  const TEACHER_ROLE_ID = 3;
  const query = `
    SELECT t1.id, t1.name
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id
    WHERE t2.static_role_id = $1 AND t2.school_id = $2
  `;
  const queryParams = [TEACHER_ROLE_ID, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

module.exports = {
  getClassTeachers,
  addClassTeacher,
  getClassTeacherById,
  updateClassTeacherById,
  findAllTeachers,
};
