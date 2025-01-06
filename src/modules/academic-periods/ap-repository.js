const processDBRequest = require("../../utils/process-db-request");

const addPeriod = async (payload) => {
  const { schoolId, academicLevelId, name, order } = payload;
  const query = `
    INSERT INTO academic_periods(school_id, academic_level_id, name, order)
    VALUES($1, $2, $3, $4)
  `;
  const queryParams = [schoolId, academicLevelId, name, order];
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
  const { schoolId, academicPeriodId } = payload;
  const query = `
    DELETE FROM academic_periods
    WHERE school_id = $1 AND id = $2
  `;
  const queryParams = [schoolId, academicPeriodId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAllPeriods = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      t1.order,
      t1.academic_level_id
    FROM academic_periods
    WHERE school_id = $1
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const assignPeriodDates = async (payload) => {
  const { schoolId, periods } = payload;
  const queryParams = [];
  const insertValues = periods
    .map((item, index) => {
      const offset = 5 * index;
      queryParams.push(schoolId, item.periodId, item.startDate, item.endDate);
      return `(
        $${offset + 1},
        $${offset + 1},
        $${offset + 1},
        $${offset + 1},
        $${offset + 1}
      )`;
    })
    .join(",");

  const query = `
    INSERT INTO academic_period_dates(school_id, academic_period_id, start_date, end_date)
    VALUES ${insertValues}
    ON CONFLICT(school_id, academic_period_id)
    DO UPDATE SET
      start_date = EXCLUDED.start_date,
      end_date = EXCLUDED.end_date;
  `;
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  addPeriod,
  updatePeriod,
  deletePeriod,
  getAllPeriods,
  assignPeriodDates,
};
