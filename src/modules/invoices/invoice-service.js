import {
  ApiError,
  assertFunctionResult,
  assertRowCount,
  handleArryResponse
} from '../../utils/index.js';
import {
  generateInvoice,
  getInvoiceById,
  getAllInvoices,
  payInvoice,
  refundInvoice,
  disputeInvoice,
  resolveDisputeInvoice,
  cancelInvoice,
  removeInvoiceItem
} from './invoice-repository.js';
import { INVOICE_MESSAGES } from './invoice-messages.js';

export const processDisputeInvoice = async (payload) => {
  await assertRowCount(disputeInvoice(payload), INVOICE_MESSAGES.DISPUTE_INVOICE_FAIL);
  return { message: INVOICE_MESSAGES.DISPUTE_INVOICE_SUCCESS };
};

export const processResolveDisputeInvoice = async (payload) => {
  await assertRowCount(
    resolveDisputeInvoice(payload),
    INVOICE_MESSAGES.RESOLVE_INVOICE_DISPUTE_FAIL
  );
  return { message: INVOICE_MESSAGES.RESOLVE_INVOICE_DISPUTE_SUCCESS };
};

export const processCancelInvoice = async (payload) => {
  await assertRowCount(cancelInvoice(payload), INVOICE_MESSAGES.CANCEL_INVOICE_FAIL);
  return { message: INVOICE_MESSAGES.CANCEL_INVOICE_SUCCESS };
};

export const processRemoveInvoiceItem = async (payload) => {
  await assertRowCount(removeInvoiceItem(payload), INVOICE_MESSAGES.REMOVE_INVOICE_ITEM_FAIL);
  return { message: INVOICE_MESSAGES.REMOVE_INVOICE_ITEM_SUCCESS };
};

export const processGenerateInvoice = async (payload) => {
  const result = await assertFunctionResult(generateInvoice(payload));
  return { message: result.message };
};

export const processGetInvoiceById = async (payload) => {
  const invoice = await getInvoiceById(payload);
  if (!invoice) {
    throw new ApiError(404, 'Invoice does not exist');
  }
  return invoice;
};

export const processGetAllInvoices = async (payload) => {
  return handleArryResponse(() => getAllInvoices(payload), 'invoices');
};

export const processPayInvoice = async (payload) => {
  const result = await assertFunctionResult(payInvoice(payload));
  return { message: result.message };
};

export const processRefundInvoice = async (payload) => {
  const result = await assertFunctionResult(refundInvoice(payload));
  return { message: result.message };
};
