const { processDBRequest } = require("../../utils");

const getAllSections = async (schoolId) => {
  const query = "SELECT * FROM sections WHERE school_id = $1";
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addNewSection = async ({ name, schoolId }) => {
  const query = "INSERT INTO sections(name, school_id) VALUES ($1, $2)";
  const queryParams = [name, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getSectionById = async ({ id, schoolId }) => {
  const query = "SELECT * FROM sections WHERE id = $1 AND school_id = $2";
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateSectionById = async (payload) => {
  const { id, name, schoolId } = payload;
  const query = `
    UPDATE sections
      SET name = $1
    WHERE id = $2 AND school_id = $3
  `;
  const queryParams = [name, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteSectionById = async ({ id, schoolId }) => {
  const query = `DELETE FROM sections WHERE id = $1 AND school_id = $2`;
  const queryParams = [id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getAllSections,
  getSectionById,
  updateSectionById,
  deleteSectionById,
  addNewSection,
};
