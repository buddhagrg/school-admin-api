import { processDBRequest } from '../../utils/process-db-request.js';

export const generateInvoice = async (payload) => {
  const query = `SELECT * FROM generate_invoices($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const getInvoiceById = async (payload) => {
  const { schoolId, invoiceId } = payload;
  const query = `
    SELECT
      t7.name AS "schoolName",
      t1.id AS "invoiceId",
      t1.invoice_number AS "invoiceNumber",
      t3.name AS "userName",
      t5.name AS "className",
      t6.name AS "sectionName",
      t4.roll,
      t1.due_date AS "dueDate",
      t8.name AS status,
      t1.amount,
      t1.discount_amt AS "discountAmt",
      t1.outstanding_amt AS "outstandingAmt",
      t10.name AS "fiscalYear",
      JSON_AGG(
          JSON_BUILD_OBJECT(
              'item', t9.description,
              'amount', t2.amount,
              'quantity', t2.quantity,
              'totalAmount', t2.total_amount
          )
      ) AS items
    FROM invoices t1
    JOIN invoice_items t2 ON t2.invoice_id = t1.id
    JOIN users t3 ON t3.id = t1.user_id
    JOIN user_profiles t4 ON t4.user_id = t1.user_id
    JOIN classes t5 ON t5.id = t4.class_id
    LEFT JOIN sections t6 ON t6.id = t4.section_id
    JOIN schools t7 ON t7.school_id = t1.school_id
    JOIN invoice_status t8 ON t8.code = t1.invoice_status_code
    JOIN fee_types t9 ON t9.code = t2.fee_type_code
    JOIN fiscal_years t10 ON t10.id = t1.fiscal_year_id
    WHERE t1.school_id = $1 AND t1.id = $2
    GROUP BY t1.id, t7.name, t1.invoice_number, t3.name, t5.name, t6.name, t4.roll,
      t1.due_date, t8.code_alias, t1.amount, t1.discount_amt, t1.outstanding_amt, t10.name
    `;
  const queryParams = [schoolId, invoiceId];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const getAllInvoices = async (payload) => {
  const { schoolId, invoiceNumber, status } = payload;
  const query = `
  SELECT
    t1.id AS "invoiceId",
    t3.name AS "userName",
    t5.name AS "className",
    t6.name AS "sectionName",
    t1.invoice_number AS "invoiceNumber",
    t2.name AS status,
    t1.description,
    t1.due_date AS "dueDate",
    t1.outstanding_amount AS "outstandingAmount",
    t1.created_date AS "createdDate",
    t1.updated_date AS "updatedDate"
  FROM invoices t1
  JOIN invoice_status t2 ON t2.code = t1.invoice_status_code
  JOIN users t3 ON t3.id = t1.user_id
  JOIN user_profiles t4 ON t4.user_id = t1.user_id
  JOIN classes t5 ON t5.id = t4.class_id
  LEFT JOIN sections t6 ON t6.id = t4.section_id
  WHERE t1.school_id = $1
  `;
  let queryParams = [schoolId];
  if (invoiceNumber) {
    query += ` AND t1.invoice_number = $${queryParams.length + 1}`;
    queryParams.push(invoiceNumber);
  }
  if (status) {
    query += ` AND t1.invoice_status_code = $${queryParams.length + 1}`;
    queryParams.push(status);
  }
  const { rows } = await processDBRequest({ query, queryParams });
  return rows;
};

export const payInvoice = async (payload) => {
  const query = `SELECT * FROM pay_invoice($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const refundInvoice = async (payload) => {
  const query = `SELECT * FROM refund_invoice($1)`;
  const queryParams = [payload];
  const { rows } = await processDBRequest({ query, queryParams });
  return rows[0];
};

export const disputeInvoice = async (payload) => {
  const { schoolId, invoiceId } = payload;
  const disputedStatus = 'DISPUTED';
  const query = `
    UPDATE invoices
    SET status = $1
    WHERE id = $2
      AND school_id = $3
      AND status IN ('ISSUED', 'PAID', 'PARTIALLY_PAID')
  `;
  const queryParams = [disputedStatus, invoiceId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const resolveDisputeInvoice = async (payload) => {
  const { schoolId, invoiceId, newInvoiceStatus } = payload;
  const query = `
    UPDATE invoices
    SET status = $1
    WHERE id = $2
      AND school_id = $3
      AND status IN ('DISPUTED')
  `;
  const queryParams = [newInvoiceStatus, invoiceId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const cancelInvoice = async (payload) => {
  const { schoolId, invoiceId } = payload;
  const cancelledStatus = 'CANCELLED';
  const query = `
    UPDATE invoices
    SET status = $1
    WHERE id = $2
      AND school_id = $3
      AND status IN ('DRAFT', 'ISSUED', 'DISPUTED')
  `;
  const queryParams = [cancelledStatus, invoiceId, schoolId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};

export const removeInvoiceItem = async (payload) => {
  const { schoolId, invoiceId, invoiceItemId } = payload;
  const query = `
  DELETE FROM
  invoice_items t1
  USING invoices t2
  WHERE t1.invoice_id = t2.id 
    AND t1.id = $1
    AND t2.school_id = $2
    AND t2.id = $3
    AND t2.invoice_status_code IN ('DRAFT', 'ISSUED', 'PARTIALLY_PAID')
  `;
  const queryParams = [invoiceItemId, schoolId, invoiceId];
  const { rowCount } = await processDBRequest({ query, queryParams });
  return rowCount;
};
