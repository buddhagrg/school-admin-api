import { processDBRequest } from '../../utils/process-db-request.js';

export const getAllAcademicYears = async (schoolId) => {
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

export const addAcademicYear = async (payload, client) => {
  const { schoolId, name, startDate, endDate, academicLevelId, isActive } = payload;
  const query = `
    INSERT INTO academic_years(school_id, academic_level_id, name, start_date, end_date, is_active)
    VALUES($1, $2, $3, $4, $5, $6)
  `;
  const queryParams = [schoolId, academicLevelId, name, startDate, endDate, isActive];
  const { rowCount } = await processDBRequest({ query, queryParams, client });
  return rowCount;
};

export const deactivateOtherAcademicYearStatus = async (schoolId, client) => {
  const query = `
    UPDATE academic_years
    SET is_active = FALSE
    WHERE school_id = $1
  `;
  const queryParams = [schoolId];
  await processDBRequest({ query, queryParams, client });
};

export const updateAcademicYear = async (payload, client) => {
  const { schoolId, name, startDate, endDate, academicYearId, academicLevelId, isActive } = payload;
  const query = `
    UPDATE academic_years
    SET name = $1,
      start_date = $2,
      end_date = $3,
      academic_level_id = $4,
      is_active = $5
    WHERE school_id = $6 AND id = $7
  `;
  const queryParams = [
    name,
    startDate,
    endDate,
    academicLevelId,
    isActive,
    schoolId,
    academicYearId
  ];
  const { rowCount } = await processDBRequest({ query, queryParams, client });
  return rowCount;
};
