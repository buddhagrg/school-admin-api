const processDBRequest = require("../../utils/process-db-request");

const getAllClasses = async (schoolId) => {
  const query = `SELECT id, name FROM classes WHERE school_id = $1 AND is_active = TRUE`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addNewClass = async (payload) => {
  const { name, schoolId, academicLevelId } = payload;
  const query = `
    INSERT INTO classes (school_id, academic_level_id, name, sort_order)
    VALUES (
      $1,
      $2,
      $3,
      (COALESCE((
        SELECT MAX(sort_order) FROM classes
        WHERE school_id = $1 AND academic_level_id = $2)
      , 0) + 1)
    )`;
  const queryParams = [schoolId, academicLevelId, name];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateClassDetailById = async (payload) => {
  const { id, name, schoolId } = payload;
  const query = `
    UPDATE classes
    SET name = $1
    WHERE school_id = $2 AND id = $3
  `;
  const queryParams = [name, schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateClassStatus = async (payload) => {
  const { schoolId, id, status } = payload;
  const query = `
    UPDATE classes
    SET is_active = $3
    WHERE school_id = $1 AND id = $2`;
  const queryParams = [schoolId, id, status];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getClassStructure = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.is_active AS "isActive",
      t3.name AS "academicLevelName",
      t1.sort_order AS "sortOrder",
      t2.id AS "sectionId",
      t2.name AS "sectionName",
      t2.sort_order AS "sectionSortOrder",
      t2.is_active AS "sectionStatus"
    FROM classes t1
    LEFT JOIN sections t2 ON t2.class_id = t1.id
    LEFT JOIN academic_levels t3 ON t3.id = t1.academic_level_id
    WHERE t1.school_id = $1
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addSection = async (payload) => {
  const { name, schoolId, classId } = payload;
  const query = `
    INSERT INTO sections(school_id, class_id, name, sort_order)
    VALUES(
      $1,
      $2,
      $3,
      (COALESCE((
        SELECT MAX(sort_order) FROM sections
        WHERE school_id = $1 AND class_id = $2)
      ,0) + 1)
    )`;
  const queryParams = [schoolId, classId, name];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateSection = async (payload) => {
  const { classId, sectionId, name, schoolId } = payload;
  const query = `
    UPDATE sections
    SET name = $1
    WHERE school_id = $2 AND class_id = $3 AND id = $4
  `;
  const queryParams = [name, schoolId, classId, sectionId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateSectionStatus = async (payload) => {
  const { schoolId, classId, sectionId, status } = payload;
  const query = `
    UPDATE sections
    SET is_active = $4
    WHERE school_id = $1 AND class_id = $2 AND id = $3
  `;
  const queryParams = [schoolId, classId, sectionId, status];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAllTeachersOfSchool = async (schoolId) => {
  const query = `
    SELECT t1.id, t1.name
    FROM users t1
    JOIN roles t2 ON t2.id = t1.role_id AND t2.static_role_id = 3
    WHERE t1.school_id = $1 AND t1.is_active = TRUE::boolean
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getAllClassTeachers = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t2.id AS "classId",
      t2.name AS "className",
      t3.name AS "teacherName"
    FROM class_teachers t1
    JOIN classes t2 ON t2.id = t1.class_id
    LEFT JOIN users t3 ON t3.id = t1.teacher_id
    WHERE t1.school_id = $1
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const assignClassTeacher = async (payload) => {
  const { classId, teacherId, schoolId } = payload;
  const query = `
    INSERT INTO class_teachers (school_id, class_id, teacher_id)
    VALUES($1, $2, $3)
    ON CONFLICT(school_id, class_id, teacher_id)
    DO UPDATE
    SET teacher_id = EXCLUDED.teacher_id
  `;
  const queryParams = [schoolId, classId, teacherId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteClassTeacher = async (payload) => {
  const { schoolId, id } = payload;
  const query = `DELETE FROM class_teachers WHERE school_id = $1 AND id = $2`;
  const queryParams = [schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getAllClasses,
  addNewClass,
  updateClassDetailById,
  updateClassStatus,
  getClassStructure,
  addSection,
  updateSection,
  updateSectionStatus,
  getAllClassTeachers,
  assignClassTeacher,
  getAllTeachersOfSchool,
  deleteClassTeacher,
};
