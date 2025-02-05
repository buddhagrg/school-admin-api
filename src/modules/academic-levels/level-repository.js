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

const getAcademicStructure = async (schoolId) => {
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

module.exports = {
  addLevel,
  getAllLevels,
  updateLevel,
  addClassToLevel,
  getAcademicStructure,
  deleteLevel,
};
