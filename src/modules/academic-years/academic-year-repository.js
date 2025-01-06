const processDBRequest = require("../../utils/process-db-request");

const getAllAcademicYears = async (schoolId) => {
  const query = `SELECT * FROM academic_years WHERE school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addAcademicYear = async (payload) => {
  const { schoolId, name, startDate, endDate, academicLevelId } = payload;
  const query = `
  INSERT INTO academic_years(school_id, academic_level_id, name, start_date, end_date)
  VALUES($1, $2, $3, $4, $5)
  `;
  const queryParams = [schoolId, academicLevelId, name, startDate, endDate];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateAcademicYear = async (payload) => {
  const { schoolId, name, startDate, endDate, academicYearId } = payload;
  const query = `
    UPDATE academic_years
    SET name = $1,
        start_date = $2,
        end_date = $3
    WHERE school_id = $4 AND id = $5
    `;
  const queryParams = [name, startDate, endDate, schoolId, academicYearId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const activateAcademicYear = async (payload) => {
  const { schoolId, academicYearId } = payload;
  const query = `
    UPDATE academic_years
    SET is_active = CASE
      WHEN id = $1 THEN TRUE
      ELSE FALSE
    END
    WHERE school_id = $1
  `;
  const queryParams = [academicYearId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  addAcademicYear,
  updateAcademicYear,
  getAllAcademicYears,
  activateAcademicYear,
};
