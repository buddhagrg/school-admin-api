const { processDBRequest } = require("../../utils/process-db-request");

const typeBySubject = "S";
const typeByName = "N";

const getAllExamNames = async (schoolId) => {
  const query = `SELECT * FROM exams WHERE type = $1 AND school_id = $2`;
  const queryParams = [typeByName, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addExamName = async (payload) => {
  const { schoolId, name } = payload;
  const query = `
    INSERT INTO exams(school_id, academic_year_id, name, type)
    SELECT
      $1,
      ay.id AS "academic_year_id",
      $3,
      $4
    FROM
    (SELECT id FROM academic_years WHERE school_id = $1 AND is_active = true LIMIT 1) AS ay;
  `;
  const queryParams = [schoolId, name, typeByName];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateExamName = async (payload) => {
  const { schoolId, examId, name } = payload;
  const query = `
    UPDATE exams
    SET name = $1
    WHERE school_id = $2 AND id = $3
  `;
  const queryParams = [name, schoolId, examId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteExamName = async (payload) => {
  const { schoolId, examId } = payload;
  const query = `DELETE FROM exams WHERE id = $1 AND school_id = $2`;
  const queryParams = [examId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const addExamDetail = async (payload) => {
  const query = `SELECT * FROM add_update_exam_detail($1)`;
  const queryParams = [payload];

  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const getExamDetail = async (payload) => {
  const { schoolId, examId, classId, sectionId } = payload;
  const query = `
    SELECT * FROM exams
    WHERE school_id = $1
      AND parent_exam_id = $2
      AND class_id = $3
      AND ($4 IS NULL OR section_id = $4)
      AND type = $5
  `;
  const queryParams = [schoolId, examId, classId, sectionId, typeBySubject];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateExamDetail = async (payload) => {
  const query = `SELECT * FROM add_update_exam_detail($1)`;
  const queryParams = [payload];

  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const getExamRoutine = async (payload) => {
  const { schoolId, examId, classId, sectionId } = payload;
  const query = `
    SELECT
      t3.name,
      JSON_AGG(
          JSON_BUILD_OBJECT(
            'subjectName',t2.name,
            'examDate', t1.exam_date,
            'startTime', t1.start_time,
            'endTime', t1.end_time
          )
      ) AS routine
    FROM exams t1
    JOIN subjects t2 ON t2.id = t1.subject_id
    JOIN exams t3 ON t3.id = t1.parent_exam_id
    WHERE t1.school_id = $1
      AND t1.type = $2
      AND t1.parent_exam_id = $3
      AND t1.class_id = $4
      AND ($5 IS NULL OR t1.class_id = $5)
    GROUP BY t3.name
  `;
  const queryParams = [schoolId, typeBySubject, examId, classId, sectionId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getMarks = async (payload) => {
  const staticStudentRoleId = 4;
  const { schoolId, classId, sectionId, examId } = payload;
  const query = `
    SELECT
      t1.id AS "userId",
      t1.name "userName",
      t2.subject_id AS "subjectId",
      t3.name AS "subjectName",
      t2.theory_marks_obtained AS "theoryMarksObtained",
      t2.practical_marks_obtained AS "practicalMarksObtained"
    FROM users t1
    LEFT JOIN marks t2
      ON t2.user_id = t1.id
      AND t2.type = $1
      AND t2.parent_exam_id = $2
    LEFT JOIN subjects t3 ON t3.id = t2.subject_id
    JOIN roles t4 ON t4.id = t1.role_id
    WHERE t4.static_role_id = $3
      AND t1.school_id = $4
      AND t1.class_id = $5
      AND ($6 IS NULL OR t1.section_id = $6)
  `;
  const queryParams = [
    typeBySubject,
    examId,
    staticStudentRoleId,
    schoolId,
    classId,
    sectionId,
  ];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addMarks = async (payload) => {
  const query = `SELECT * FROM add_update_mark_detail($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateMarks = async (payload) => {
  const query = `SELECT * FROM add_update_mark_detail($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const getExamMarksheet = async (payload) => {
  const { schoolId, classId, sectionId, examId, userId } = payload;
  const query = `
  SELECT
    t2.name,
    t3.roll,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'name', t4.name,
        'theoryMarksObtained', t1.theory_marks_obtained,
        'practicalMarksObtained', t1.practical_marks_obtained,
        'totalMarksObtained', t1.total_marks_obtained,
        'grade', t1.grade
      )
    ) AS subjects
  FROM marks t1
  LEFT JOIN users t2 ON t2.id = t1.user_id
  LEFT JOIN user_profiles t3 ON t3.user_id = t1.user_id
  LEFT JOIN subjects t4 ON t4.id = t1.subject_id
  WHERE t1.school_id = $1
    AND ($2 IS NULL OR t1.user_id = $2)
    AND t1.class_id = $3
    AND ($4 IS NULL OR t1.section_id = $4)
    AND t1.exam_id = $5
    GROUP BY t2.name, t3.roll
  `;
  const queryParams = [schoolId, userId, classId, sectionId, examId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

module.exports = {
  getAllExamNames,
  addExamName,
  updateExamName,
  deleteExamName,
  getExamRoutine,
  addExamDetail,
  addMarks,
  getExamMarksheet,
  getExamDetail,
  updateExamDetail,
  updateMarks,
  getMarks,
};
