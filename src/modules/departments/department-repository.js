const processDBRequest = require("../../utils/process-db-request");

const getAllDepartments = async (schoolId) => {
  const query = "SELECT * FROM departments WHERE school_id = $1";
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addNewDepartment = async ({ name, schoolId }) => {
  const query = "INSERT INTO departments(name, school_id) VALUES ($1, $2)";
  const queryParams = [name, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getDepartmentById = async ({ id, schoolId }) => {
  const query = "SELECT * FROM departments WHERE id = $1 AND school_id = $2";
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

const updateDepartmentById = async (payload) => {
  const { id, name, schoolId } = payload;
  const query = `
    UPDATE departments
    SET name = $1
    WHERE id = $2 AND school_id = $3
  `;
  const queryParams = [name, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deleteDepartmentById = async ({ id, schoolId }) => {
  const query = `DELETE FROM departments WHERE id = $1 AND school_id = $2`;
  const queryParams = [id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  updateDepartmentById,
  deleteDepartmentById,
  addNewDepartment,
};
