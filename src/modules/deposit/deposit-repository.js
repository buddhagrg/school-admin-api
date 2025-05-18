import { processDBRequest } from '../../utils/process-db-request.js';

export const addDeposit = async (payload) => {
  const { schoolId, userId, amount, reason } = payload;
  const query = `
    INSERT INTO deposits(school_id, user_id, amount, reason)
    VALUES($1, $2, $3, $4)
    `;
  const queryParams = [schoolId, userId, amount, reason];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const getDeposit = async (payload) => {
  const { id, schoolId } = payload;
  const query = `
    SELECT
        t2.name AS "userName",
        COALESCE(t1.amount, 0) AS amount,
        t1.reason
    FROM deposits t1
    JOIN users t2 ON t2.id = t1.user_id
    WHERE t1.id = $1 AND t1.school_id = $2
    `;
  const queryParams = [id, schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const getDeposits = async (schoolId) => {
  const query = `
    SELECT
        t2.name AS "userName",
        COALESCE(t1.amount, 0) AS amount,
        t1.reason
    FROM deposits t1
    JOIN users t2 ON t2.id = t1.user_id
    WHERE t1.school_id= $1    
    `;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const updateDeposit = async (payload) => {
  const { schoolId, id, amount, reason } = payload;
  const query = `
    UPDATE deposits
    SET amount = $1 AND reason = $2
    WHERE id = $3 AND school_id = $4
    `;
  const queryParams = [amount, reason, id, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const refundDeposit = async (payload) => {
  const { schoolId, id, reason } = payload;
  const depositRefundAmt = 0;
  const depositRefundStatus = 'REFUNDED';
  const query = `
    UPDATE deposits
    SET amount = $1, reason = $2, status = $3
    WHERE school_id = $4 AND id = $5
  `;
  const queryParams = [depositRefundAmt, reason, depositRefundStatus, schoolId, id];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};
