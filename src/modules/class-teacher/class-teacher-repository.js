const { processDBRequest } = require("../../utils");

const getClassTeachers = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.class_name AS class,
      t1.section_name AS section,
      t2.name as "teacher"
    FROM class_teachers t1
    LEFT JOIN users t2 ON t1.teacher_id =  t2.id
    WHERE t1.school_id = $1
    ORDER BY t1.class_name
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addClassTeacher = async (payload) => {
  const { className, section, teacher, schoolId } = payload;
  const query = `
    INSERT INTO class_teachers (class_name, section_name, teacher_id, school_id)
    VALUES($1, $2, $3, $4)
  `;
  const queryParams = [className, section, teacher, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getClassTeacherById = async ({ id, schoolId }) => {
  const query = `
    SELECT
      id,
      class_name AS class,
      section_name AS section,
      teacher_id AS teacher
    FROM class_teachers
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
  const { id, className, section, teacher, schoolId } = payload;
  const query = `
    UPDATE class_teachers
    SET
      class_name = $1,
      section_name = $2,
      teacher_id = $3
    WHERE id = $4 AND school_id = $5
  `;
  const queryParams = [className, section, teacher, id, schoolId];
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
