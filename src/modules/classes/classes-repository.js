const { processDBRequest } = require("../../utils");

const getAllClasses = async (schoolId) => {
  const query = "SELECT * FROM classes WHERE school_id = $1 ORDER BY name";
  const queryParams = [schoolId];
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
  const { name, sections, schoolId } = payload;
  const query = `
    INSERT INTO classes (name, sections, school_id)
    VALUES ($1, $2, $3)
  `;
  const queryParams = [name, sections, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updateClassDetailById = async (payload) => {
  const { id, name, sections, schoolId } = payload;
  const query = `
    UPDATE classes
    SET name = $1, sections = $2
    WHERE id = $3 AND school_id = $4
  `;
  const queryParams = [name, sections, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteClassById = async ({ id, schoolId }) => {
  const query = "DELETE FROM classes WHERE id = $1 AND school_id = $2";
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
