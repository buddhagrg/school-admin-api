const { db } = require("../../config");
const processDBRequest = require("../../utils/process-db-request");

const addLevel = async (payload) => {
  const { schoolId, name } = payload;
  const query = `
    INSERT INTO academic_levels(school_id, name)
    VALUES($1, $2)
    `;
  const queryParams = [schoolId, name];
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

const addClassToLevel = async (payload) => {
  const { academicLevelId, schoolId, classId } = payload;
  const query = `
    UPDATE classes
    SET academic_level_id = $1
    WHERE school_id = $2 AND id = $3
  `;
  const queryParams = [academicLevelId, schoolId, classId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAcademicLevelsWithPeriods = async (schoolId) => {
  const query = `
    SELECT
      t2.id,
      t2.name,
      t1.id AS "academicLevelId",
      t1.name AS "academicLevelName",
      t2.sort_order AS "sortOrder"
    FROM academic_levels t1
    LEFT JOIN academic_periods t2 ON t2.academic_level_id = t1.id
    WHERE t1.school_id = $1
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const deleteLevel = async (payload) => {
  const { schoolId, academicLevelId } = payload;
  const query = `
    DELETE FROM academic_levels
    WHERE school_id = $1 AND id = $2
  `;
  const queryParams = [schoolId, academicLevelId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getLevelsWithClasses = async (schoolId) => {
  const query = `
    SELECT
      t2.id,
      t2.name,
      t2.sort_order AS "sortOrder",
      t1.id AS "academicLevelId",
      t1.name AS "academicLevelName"
    FROM academic_levels t1
    LEFT JOIN classes t2 ON t2.academic_level_id = t1.id
    WHERE t1.school_id = $1
  `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const deleteLevelFromClass = async (payload) => {
  const { schoolId, classId } = payload;
  const query = `
    UPDATE classes
    SET academic_level_id = NULL
    WHERE school_id = $1 AND id = $2
  `;
  const queryParams = [schoolId, classId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const reorderPeriods = async (payload) => {
  const { schoolId, periods, academicLevelId } = payload;
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const periodsList = periods.map(({ id }) => id).join(", ");
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
      client,
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
        .join("")}
      ELSE sort_order
    END
    WHERE school_id = $1 AND id IN (${periodsList})
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

const getPeriodsDates = async (payload) => {
  const { schoolId, academicLevelId } = payload;
  const query = `
    SELECT
      id,
      name,
      start_date AS "startDate",
      end_date AS "endDate"
    FROM academic_periods
    WHERE school_id = $1 AND academic_level_id = $2
  `;
  const queryParams = [schoolId, academicLevelId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const updatePeriodsDates = async (payload) => {
  const { schoolId, periodsDates, academicLevelId } = payload;
  const query = `
    UPDATE academic_periods AS t1
    SET
      start_date = (t2.value ->> 'startDate')::DATE,
      end_date = (t2.value ->> 'endDate')::DATE
    FROM (
        SELECT
          (value ->> 'id')::INT AS id,
          value
        FROM
          jsonb_array_elements($2::jsonb) AS t2(value)
    ) AS t2
    WHERE
      t1.school_id = $1
      AND t1.id = t2.id
      AND t1.academic_level_id = $3;
  `;
  const queryParams = [schoolId, JSON.stringify(periodsDates), academicLevelId];

  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  addLevel,
  getAllLevels,
  updateLevel,
  addClassToLevel,
  getAcademicLevelsWithPeriods,
  deleteLevel,
  getLevelsWithClasses,
  deleteLevelFromClass,
  reorderPeriods,
  getPeriodsDates,
  updatePeriodsDates,
};
