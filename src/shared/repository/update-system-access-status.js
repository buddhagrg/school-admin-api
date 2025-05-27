import { processDBRequest } from '../../utils/process-db-request';

export const updateUserSystemAccessStatus = async (payload) => {
  const { hasSystemAccess, userId, schoolId } = payload;
  const query = `
    UPDATE users
    SET has_system_access = $1
    WHERE school_id = $2 AND id = $3
    `;
  const queryParams = [hasSystemAccess, schoolId, userId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};
