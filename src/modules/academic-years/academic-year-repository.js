const processDBRequest = require("../../utils/process-db-request");

const getAllAcademicYears = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.is_active AS "isActive",
      t1.start_date AS "startDate",
      t1.end_date AS "endDate",
      t1.academic_level_id AS "academicLevelId",
      t2.name AS "academicLevelName"
    FROM academic_years t1
    JOIN academic_levels t2 ON t2.id = t1.academic_level_id
    WHERE t1.school_id = $1
    ORDER BY
      t1.is_active DESC,
      t1.start_date DESC
  `;
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
  const {
    schoolId,
    name,
    startDate,
    endDate,
    academicYearId,
    academicLevelId,
  } = payload;
  const query = `
    UPDATE academic_years
    SET name = $1,
        start_date = $2,
        end_date = $3,
        academic_level_id = $4
    WHERE school_id = $5 AND id = $6
    `;
  const queryParams = [
    name,
    startDate,
    endDate,
    academicLevelId,
    schoolId,
    academicYearId,
  ];
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
    WHERE school_id = $2
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
