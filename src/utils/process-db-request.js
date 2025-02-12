const { db } = require("../config");
const { ERROR_MESSAGES } = require("../constants");
const { ApiError } = require("./api-error");

const processDBRequest = async ({ query, queryParams, client }) => {
  let txnClient = client;
  const isInternalClient = !client;

  if (isInternalClient) {
    txnClient = await db.connect();
  }
  try {
    const result = await txnClient.query(query, queryParams);
    return result;
  } catch (error) {
    console.log(error)
    throw new ApiError(500, ERROR_MESSAGES.DATABASE_ERROR);
  } finally {
    if (isInternalClient) {
      txnClient.release();
    }
  }
};

module.exports = processDBRequest;
