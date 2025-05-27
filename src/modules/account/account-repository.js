import { processDBRequest } from '../../utils/process-db-request.js';

export const changePassword = async ({ userId, hashedPassword, schoolId }, client) => {
  const query = `
    UPDATE users
    SET password = $1
    WHERE id = $2 AND school_id = $3
  `;
  const queryParams = [hashedPassword, userId, schoolId];
  await processDBRequest({ query, queryParams, client });
};
