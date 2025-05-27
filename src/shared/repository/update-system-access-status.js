import { processDBRequest } from '../../utils/process-db-request.js';
import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';

export const updateUserSystemAccessStatus = async (payload) => {
  const { hasSystemAccess, userId, schoolId } = payload;
  if (Number(userId) === 2) {
    throw new ApiError(500, ERROR_MESSAGES.DISABLED_IN_DEMO_ACCOUNT);
  }

  const query = `
    UPDATE users
    SET has_system_access = $1
    WHERE school_id = $2 AND id = $3
    `;
  const queryParams = [hasSystemAccess, schoolId, userId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};
