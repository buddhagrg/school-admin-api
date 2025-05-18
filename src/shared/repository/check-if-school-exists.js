import { processDBRequest } from '../../utils/process-db-request.js';

export const checkIfSchoolExists = async ({ schoolId, client }) => {
  const query = `SELECT * FROM schools WHERE school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams, client });
  return rows[0];
};
