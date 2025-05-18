import { processDBRequest } from '../../utils/process-db-request.js';

export const getAllClassTeachers = async (schoolId) => {
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

export const assignClassTeacher = async (payload) => {
  const { classId, teacherId, schoolId } = payload;
  const query = `
    INSERT INTO class_teachers(school_id, class_id, teacher_id)
    VALUES($1, $2, $3)
  `;
  const queryParams = [schoolId, classId, teacherId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updateClassTeacher = async (payload) => {
  const { id, teacherId, schoolId } = payload;
  const query = `
    UPDATE class_teachers
    SET teacher_id = $1
    WHERE school_id = $2 AND id = $3
    `;
  const queryParams = [teacherId, schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};
