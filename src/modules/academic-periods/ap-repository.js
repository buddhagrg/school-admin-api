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

module.exports = {
  addPeriod,
  updatePeriod,
  deletePeriod,
};
