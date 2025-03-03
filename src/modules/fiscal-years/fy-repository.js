const processDBRequest = require("../../utils/process-db-request");

const addFiscalYear = async (payload) => {
  const { schoolId, name, startDate, endDate } = payload;
  const query = `
    INSERT INTO fiscal_years(school_id, name, start_date, end_date)
    VALUES($1, $2, $3, $4)
    `;
  const queryParams = [schoolId, name, startDate, endDate];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateFiscalYear = async (payload) => {
  const { schoolId, name, startDate, endDate, fiscalYearId } = payload;
  const query = `
    UPDATE fiscal_years
    SET
      name = $1,
      start_date = $2,
      end_date = $3
    WHERE school_id = $4 AND id = $5
  `;
  const queryParams = [name, startDate, endDate, schoolId, fiscalYearId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAllFiscalYears = async (schoolId) => {
  const query = `
    SELECT
      id,
      name,
      start_date AS "startDate",
      end_date AS "endDate",
      is_active AS "isActive"
    FROM fiscal_years
    WHERE school_id = $1
    ORDER BY
      is_active DESC,
      start_date DESC
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const activateFiscalYear = async (payload) => {
  const { schoolId, fiscalYearId } = payload;
  const query = `
    UPDATE fiscal_years
    SET is_active = CASE
      WHEN id = $1 THEN TRUE
      ELSE FALSE
    END
    WHERE school_id = $2
  `;
  const queryParams = [fiscalYearId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  addFiscalYear,
  updateFiscalYear,
  getAllFiscalYears,
  activateFiscalYear,
};
