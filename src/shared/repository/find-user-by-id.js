import { processDBRequest } from '../../utils/process-db-request.js';

export const findUserById = async (id) => {
  const query = `
    SELECT
      id,
      email,
      role_id,
      password,
      has_system_access
    FROM users where id = $1`;
  const queryParams = [id];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};
