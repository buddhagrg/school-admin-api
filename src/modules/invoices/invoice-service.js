import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
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

export const processGenerateInvoice = async (payload) => {
  const result = await generateInvoice(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }
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
  const invoices = await getAllInvoices(payload);
  if (invoices.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { invoices };
};

export const processPayInvoice = async (payload) => {
  const result = await payInvoice(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};

export const processRefundInvoice = async (payload) => {
  const result = await refundInvoice(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};

export const processDisputeInvoice = async (payload) => {
  const affectedRow = await disputeInvoice(payload);
  if (affectedRow.length <= 0) {
    throw new ApiError(500, 'Unable to dispute invoice');
  }
  return { message: 'Invoice disputed successfully' };
};

export const processResolveDisputeInvoice = async (payload) => {
  const affectedRow = await resolveDisputeInvoice(payload);
  if (affectedRow.length <= 0) {
    throw new ApiError(500, 'Unable to resolve invoice dispute');
  }
  return { message: 'Invoice disput resolved successfully' };
};

export const processCancelInvoice = async (payload) => {
  const affectedRow = await cancelInvoice(payload);
  if (affectedRow.length <= 0) {
    throw new ApiError(500, 'Unable to cancel invoice');
  }
  return { message: 'Invoice cancelled successfully' };
};

export const processRemoveInvoiceItem = async (payload) => {
  const affectedRow = await removeInvoiceItem(payload);
  if (affectedRow.length <= 0) {
    throw new ApiError(500, 'Unable to remove invoice item');
  }
  return { message: 'Invoice item deleted successfully' };
};
