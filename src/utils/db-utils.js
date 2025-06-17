import { ApiError } from './api-error.js';
import { db } from '../config/index.js';
import { DB_TXN } from '../constants/index.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export const withTransaction = async (fn, errorMsg) => {
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const result = await fn(client);
    await client.query(DB_TXN.COMMIT);
    return result;
  } catch (error) {
    console.log(error)
    await client.query(DB_TXN.ROLLBACK);
    throw error instanceof ApiError ? error : new ApiError(500, errorMsg);
  } finally {
    client.release();
  }
};

export const handleArryResponse = async (fn, key, formatter = (data) => data) => {
  const result = await fn();
  if (!Array.isArray(result) || result.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { [key]: formatter(result) };
};

export const handleObjectResponse = async (fn, errorMsg) => {
  const result = await fn();
  if (!result || Object.keys(result).length === 0) {
    throw new ApiError(404, errorMsg || ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return result;
};

export async function assertRowCount(promise, errorMsg, statusCode = 500) {
  const rowCount = await promise;
  if (rowCount <= 0) {
    throw new ApiError(statusCode, errorMsg);
  }
}

export async function assertFunctionResult(promise) {
  const result = await promise;
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }

  return result;
}
