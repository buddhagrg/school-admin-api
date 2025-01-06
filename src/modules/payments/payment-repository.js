const processDBRequest = require("../../utils/process-db-request");

const doGeneralPayment = async (payload) => {
  const { schoolId, initiator, amount, feeId, paymentMethod } = payload;
  const query = `
    INSERT INTO transactions(school_id, academic_year_id, fiscal_year_id, initiator, type, status, amount, payment_method, fee_id)
    SELECT
      $1,
      ay.id AS academic_year_id,
      fy.id AS fiscal_year_id,
      $2, $3, $4, $5, $6, $7
    FROM
    (SELECT id FROM academic_years WHERE school_id = $1 AND is_active = TRUE LIMIT 1) ay,
    (SELECT id FROM fiscal_years WHERE school_id = $1 AND is_active = TRUE LIMIT 1) fy;
  `;
  const queryParams = [
    schoolId,
    initiator,
    "CREDIT",
    "SUCCESS",
    amount,
    paymentMethod,
    feeId,
  ];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const getAllPaymentMethods = async (schoolId) => {
  const query = `SELECT * FROM payment_methods WHERE school_id = $1`;
  const queryParams = [schoolId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

const addPaymentMethod = async (payload) => {
  const { schoolId, name, description } = payload;
  const query = `
        INSERT INTO payment_methods(school_id, name, description)
        VALUES( $1, $2)
    `;
  const queryParams = [schoolId, name, description];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const updatePaymentMethod = async (payload) => {
  const { schoolId, paymentMethodId, name, description } = payload;
  const now = new Date();
  const query = `
    UPDATE payment_methods
    SET name = $1, description = $2, updated_date = $3
    WHERE school_id = $4 AND id = $5
    `;
  const queryParams = [name, description, now, schoolId, paymentMethodId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

const deactivatePaymentMethod = async (payload) => {
  const { schoolId, paymentMethodId } = payload;
  const query = `
    UPDATE payment_methods
    SET is_active = FALSE
    WHERE school_id = $1 AND id = $2
    `;
  const queryParams = [schoolId, paymentMethodId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

module.exports = {
  doGeneralPayment,
  getAllPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deactivatePaymentMethod,
};
