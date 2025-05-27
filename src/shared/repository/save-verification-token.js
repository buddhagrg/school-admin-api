import { processDBRequest } from '../../utils/process-db-request.js';

export const saveVerificationToken = async (payload, client) => {
  const { identifier, purpose, hash, expiryAt } = payload;
  const query = `
    INSERT INTO verification_tokens(identifier, purpose, hash_key, expiry_at)
    VALUES($1, $2, $3, $4)
  `;
  const queryParams = [identifier, purpose, hash, expiryAt];
  const { rowCount } = await processDBRequest({ query, queryParams, client });
  return rowCount;
};
