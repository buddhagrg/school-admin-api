const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils/api-error");
const {
  addInvoice,
  updateInvoice,
  getInvoiceById,
  getAllInvoices,
  payInvoice,
  refundInvoice,
  disputeInvoice,
  resolveDisputeInvoice,
  cancelInvoice,
  removeInvoiceItem,
} = require("./invoice-repository");

const processAddInvoice = async (payload) => {
  const result = await addInvoice(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }

  return { message: result.message };
};

const processUpdateInvoice = async (payload) => {
  const result = await updateInvoice(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }

  return { message: result.message };
};

const processGetInvoiceById = async (payload) => {
  const invoice = await getInvoiceById(payload);
  if (!invoice) {
    throw new ApiError(404, "Invoice does not exist");
  }

  return invoice;
};

const processGetAllInvoices = async (payload) => {
  const invoices = await getAllInvoices(payload);
  if (invoices.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return invoices;
};

const processPayInvoice = async (payload) => {
  const result = await payInvoice(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }

  return { message: result.message };
};

const processRefundInvoice = async (payload) => {
  const result = await refundInvoice(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }

  return { message: result.message };
};

const processDisputeInvoice = async (payload) => {
  const affectedRow = await disputeInvoice(payload);
  if (affectedRow.length <= 0) {
    throw new ApiError(500, "Unable to dispute invoice");
  }

  return { message: "Invoice disputed successfully" };
};

const processResolveDisputeInvoice = async (payload) => {
  const affectedRow = await resolveDisputeInvoice(payload);
  if (affectedRow.length <= 0) {
    throw new ApiError(500, "Unable to resolve invoice dispute");
  }

  return { message: "Invoice disput resolved successfully" };
};

const processCancelInvoice = async (payload) => {
  const affectedRow = await cancelInvoice(payload);
  if (affectedRow.length <= 0) {
    throw new ApiError(500, "Unable to cancel invoice");
  }

  return { message: "Invoice cancelled successfully" };
};

const processRemoveInvoiceItem = async (payload) => {
  const affectedRow = await removeInvoiceItem(payload);
  if (affectedRow.length <= 0) {
    throw new ApiError(500, "Unable to remove invoice item");
  }

  return { message: "Invoice item deleted successfully" };
};

module.exports = {
  processAddInvoice,
  processUpdateInvoice,
  processGetInvoiceById,
  processGetAllInvoices,
  processPayInvoice,
  processRefundInvoice,
  processDisputeInvoice,
  processResolveDisputeInvoice,
  processCancelInvoice,
  processRemoveInvoiceItem,
};
