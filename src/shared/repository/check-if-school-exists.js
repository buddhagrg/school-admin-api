const processDBRequest = require("../../utils/process-db-request");

const checkIfSchoolExists = async ({ schoolId, client }) => {
  const query = `SELECT * FROM schools WHERE school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0];
};

module.exports = { checkIfSchoolExists };
