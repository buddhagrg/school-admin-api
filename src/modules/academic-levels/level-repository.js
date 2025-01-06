const processDBRequest = require("../../utils/process-db-request");

const addLevel = async (payload) => {
  const {
    schoolId,
    name,
    startGrade,
    endGrade,
    academicYearStart,
    academicYearEnd,
  } = payload;
  const query = `
    INSERT INTO academic_levels(school_id, name, start_grade, end_grade, academic_year_start, academic_year_end)
    VALUES($1, $2, $3, $4, $5)
    `;
  const queryParams = [
    schoolId,
    name,
    startGrade,
    endGrade,
    academicYearStart,
    academicYearEnd,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAllLevels = async (schoolId) => {
  const query = `SELECT * FROM academic_levels WHERE school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const updateLevel = async (payload) => {
  const {
    levelId,
    schoolId,
    name,
    startGrade,
    endGrade,
    academicYearStart,
    academicYearEnd,
  } = payload;
  const query = `
    UPDATE academic_levels
    SET name = $1,
      start_grade = $2,
      end_grade = $3,
      academic_year_start = $4,
      academic_year_end = $5
    WHERE school_id = $6 AND id = $7
    `;
  const queryParams = [
    name,
    startGrade,
    endGrade,
    academicYearStart,
    academicYearEnd,
    schoolId,
    levelId,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = { addLevel, getAllLevels, updateLevel };
