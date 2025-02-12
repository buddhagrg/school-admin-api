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

const assignPeriodDates = async (payload) => {
  const { schoolId, periods } = payload;
  const queryParams = [];
  const insertValues = periods
    .map((item, index) => {
      const offset = 5 * index;
      queryParams.push(
        schoolId,
        item.academicPeriodId,
        item.startDate,
        item.endDate
      );
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

const updatePeriodOrder = async (payload) => {
  const { schoolId, periods, academicLevelId } = payload;
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const negativeOrderQueryParams = [schoolId, academicLevelId];
    const negativeOrderQuery = `
      UPDATE academic_Periods
      SET sort_order = -sort_order
      WHERE school_id = $1
        AND academic_level_id = $2
        AND id IN(${periods.map(({ id }) => id).join(", ")});
    `;
    await processDBRequest({
      query: negativeOrderQuery,
      queryParams: negativeOrderQueryParams,
      client,
    });

    const query = `
    UPDATE academic_periods
    SET sort_order = CASE
      ${periods
        .map(
          ({ id, orderId }) => `
          WHEN id = ${id} THEN ${orderId}
        `
        )
        .join("")}
      ELSE sort_order
    END
    WHERE school_id = $1 AND id IN (${periods.map(({ id }) => id).join(", ")})
  `;
    const queryParams = [schoolId];
    const { rowCount } = await processDBRequest({ query, queryParams, client });

    await client.query("COMMIT");
    return rowCount;
  } catch (error) {
    await client.query("ROLLBACK");
    return 0;
  } finally {
    client.release();
  }
};

module.exports = {
  addPeriod,
  updatePeriod,
  deletePeriod,
  getAllPeriods,
  assignPeriodDates,
  updatePeriodOrder,
};
