import { db } from '../config/index.js';
import { ERROR_MESSAGES } from '../constants/index.js';
import { ApiError } from './api-error.js';

export const processDBRequest = async ({ query, queryParams, client }) => {
  let txnClient = client;
  const isInternalClient = !client;
  if (isInternalClient) {
    txnClient = await db.connect();
  }
  try {
    const result = await txnClient.query(query, queryParams);
    return result;
  } catch (error) {
    console.log(error);
    throw new ApiError(500, ERROR_MESSAGES.DATABASE_ERROR);
  } finally {
    if (isInternalClient) {
      txnClient.release();
    }
  }
};
