const processDBRequest = require("../../utils/process-db-request");

const getAllClasses = async (schoolId) => {
  const query = `
    SELECT
      t1.name AS "className",
	    JSON_AGG(t2.name) as sections
    FROM classes t1
    LEFT JOIN sections t2 ON t2.class_id = t1.id
    WHERE t1.school_id = $1
      AND t1.is_active = $2
    GROUP BY t1.name
  `;
  const queryParams = [schoolId, true];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const getClassDetail = async ({ id, schoolId }) => {
  const query = "SELECT * from classes WHERE id = $1 AND school_id = $2";
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({
    query,
    queryParams,
  });
  return rows[0];
};

const addNewClass = async (payload) => {
  const { name, schoolId } = payload;
  const query = `
    INSERT INTO classes (name, school_id)
    VALUES ($1, $2)
  `;
  const queryParams = [name, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateClassDetailById = async (payload) => {
  const { id, name, schoolId } = payload;
  const query = `
    UPDATE classes
    SET name = $1
    WHERE id = $3 AND school_id = $4
  `;
  const queryParams = [name, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteClassById = async ({ id, schoolId }) => {
  const query = `
    UPDATE classes SET is_active = $1
    WHERE id = $3 AND school_id = $4
  `;
  const queryParams = [id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getAllClasses,
  getClassDetail,
  addNewClass,
  updateClassDetailById,
  deleteClassById,
};
