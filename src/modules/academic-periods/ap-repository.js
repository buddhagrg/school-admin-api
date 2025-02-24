const { db } = require("../../config");
const processDBRequest = require("../../utils/process-db-request");

const addPeriod = async (payload) => {
  const { schoolId, academicLevelId, name } = payload;
  const query = `
    INSERT INTO academic_periods(school_id, academic_level_id, name, sort_order)
    VALUES(
    $1,
    $2,
    $3,
    COALESCE((
      SELECT MAX(sort_order) FROM academic_periods
      WHERE school_id = $1 AND academic_level_id = $2)
    ,0) + 1)
  `;
  const queryParams = [schoolId, academicLevelId, name];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updatePeriod = async (payload) => {
  const { schoolId, name, academicPeriodId } = payload;
  const query = `
    UPDATE academic_periods
    SET name = $1
    WHERE school_id = $2 AND id = $3
  `;
  const queryParams = [name, schoolId, academicPeriodId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deletePeriod = async (payload) => {
  const query = `SELECT * FROM delete_period_order($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const getAllPeriods = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.sort_order,
      t1.academic_level_id
    FROM academic_periods
    WHERE school_id = $1
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getAllPeriodDates = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.sort_order AS "sortOrder",
      t1.start_date AS "startDate",
      t1.end_date AS "endDate",
      t2.name AS "academicLevelName"
    FROM periods t1
    JOIN academic_levels t2 On t2.id = t1.academic_level_id
    WHERE t1.school_id = $1
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const definePeriodsDates = async (payload) => {
  const { schoolId, periods } = payload;
  const query = `
    UPDATE academic_periods t1
    SET
      t1.start_date = t2.startDate::DATE,
      t1.end_date = t2.endDate::DATE
    FROM (
      SELECT * FROM jsonb_to_recordset($2::jsonb)
      AS t2(id INT, startDate TEXT, endDate TEXT)
    ) AS t2
    WHERE t1.school_id = $1 AND t1.id = t2.id
  `;
  const queryParams = [schoolId, JSON.stringify(periods)];

  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  addPeriod,
  updatePeriod,
  deletePeriod,
  getAllPeriods,
  getAllPeriodDates,
  definePeriodsDates,
};
