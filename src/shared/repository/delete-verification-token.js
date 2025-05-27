import { processDBRequest } from '../../utils/process-db-request.js';

export const deleteVerificationToken = async (payload, client) => {
  const { identifier, purpose, hashKey } = payload;
  const query = `
    DELETE FROM verification_tokens
    WHERE identifier = $1
        AND purpose = $2
        AND hash_key = $3
        AND expiry_at >= now()
    `;
  const queryParams = [identifier, purpose, hashKey];
  const { rowCount } = await processDBRequest({ query, queryParams, client });
  return rowCount;
};
