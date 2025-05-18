import { db } from '../../config/index.js';
import { DB_TXN } from '../../constants/index.js';
import { processDBRequest } from '../../utils/process-db-request.js';

export const addLevel = async (payload) => {
  const { schoolId, name } = payload;
  const query = `
    INSERT INTO academic_levels(school_id, name)
    VALUES($1, $2)
    `;
  const queryParams = [schoolId, name];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getAllLevels = async (schoolId) => {
  const query = `
    SELECT
      t1.id,
      t1.name,
      COUNT(t2.id) as "totalPeriods"
    FROM academic_levels t1
    LEFT JOIN academic_periods t2 ON t2.academic_level_id = t1.id
    WHERE t1.school_id = $1
    GROUP BY t1.id, t1.name
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const updateLevel = async (payload) => {
  const { academicLevelId, schoolId, name } = payload;
  const query = `
    UPDATE academic_levels
    SET name = $1
    WHERE school_id = $2 AND id = $3
  `;
  const queryParams = [name, schoolId, academicLevelId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const deleteLevel = async (payload) => {
  const { schoolId, academicLevelId } = payload;
  const query = `
    DELETE FROM academic_levels
    WHERE school_id = $1 AND id = $2
  `;
  const queryParams = [schoolId, academicLevelId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const reorderPeriods = async (payload) => {
  const { schoolId, periods, academicLevelId } = payload;
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const periodsList = periods.map(({ id }) => id).join(', ');
    const negativeOrderQueryParams = [schoolId, academicLevelId];
    const negativeOrderQuery = `
      UPDATE academic_Periods
      SET sort_order = -sort_order
      WHERE school_id = $1
        AND academic_level_id = $2
        AND id IN(${periodsList});
    `;
    await processDBRequest({
      query: negativeOrderQuery,
      queryParams: negativeOrderQueryParams,
      client
    });
    const query = `
    UPDATE academic_periods
    SET sort_order = CASE
      ${periods
        .map(
          ({ id, sortOrder }) => `
          WHEN id = ${id} THEN ${sortOrder}
        `
        )
        .join('')}
      ELSE sort_order
    END
    WHERE school_id = $1 AND id IN (${periodsList})
  `;
    const queryParams = [schoolId];
    const { rowCount } = await processDBRequest({ query, queryParams, client });
    await client.query(DB_TXN.COMMIT);
    return rowCount;
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    return 0;
  } finally {
    client.release();
  }
};

export const getPeriodsOfLevel = async (payload) => {
  const { schoolId, academicLevelId } = payload;
  const query = `
    SELECT 
      id,
      academic_level_id AS "academicLevelId",
      name,
      sort_order AS "sortOrder",
      start_date AS "startDate",
      end_date AS "endDate"
    FROM academic_periods
    WHERE school_id = $1 AND academic_level_id = $2
  `;
  const queryParams = [schoolId, academicLevelId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const addPeriod = async (payload) => {
  const { schoolId, academicLevelId, name, startDate, endDate } = payload;
  const query = `
    INSERT INTO academic_periods(school_id, academic_level_id, name, start_date, end_date, sort_order)
    VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    COALESCE((
      SELECT MAX(sort_order) FROM academic_periods
      WHERE school_id = $1 AND academic_level_id = $2)
    ,0) + 1)
  `;
  const queryParams = [schoolId, academicLevelId, name, startDate, endDate];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const updatePeriod = async (payload) => {
  const { name, schoolId, academicLevelId, academicPeriodId, startDate, endDate } = payload;
  const query = `
    UPDATE academic_periods
    SET
      name = $1,
      start_date = $2,
      end_date = $3
    WHERE school_id = $4
      AND id = $5
      AND academic_level_id = $6
  `;
  const queryParams = [name, startDate, endDate, schoolId, academicPeriodId, academicLevelId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const deletePeriod = async (payload) => {
  const query = `SELECT * FROM delete_period_order($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};
