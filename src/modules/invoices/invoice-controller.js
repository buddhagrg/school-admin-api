const asyncHandler = require("express-async-handler");
const {
  processGenerateInvoice,
  processGetInvoiceById,
  processGetAllInvoices,
  processPayInvoice,
  processRefundInvoice,
  processDisputeInvoice,
  processResolveDisputeInvoice,
  processCancelInvoice,
  processRemoveInvoiceItem,
} = require("./invoice-service");

const handleGenerateInvoice = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await processGenerateInvoice({ ...payload, schoolId });
  res.json(response);
});

const handleGetInvoiceById = asyncHandler(async (req, res) => {
  const { id: invoiceId } = req.params;
  const { schoolId } = req.user;
  const response = await processGetInvoiceById({ invoiceId, schoolId });
  res.json(response);
});

const handleGetAllInvoices = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { invoiceNumber, status } = req.query;
  const response = await processGetAllInvoices({
    invoiceNumber,
    status,
    schoolId,
  });
  res.json(response);
});

const handlePayInvoice = asyncHandler(async (req, res) => {
  const { schoolId, id: initiator } = req.user;
  const { id: invoiceId } = req.params;
  const { amount: paymentAmount, method: paymentMethod } = req.body;
  const response = await processPayInvoice({
    invoiceId,
    paymentAmount,
    schoolId,
    initiator,
    paymentMethod,
  });
  res.json(response);
});

const handleRefundInvoice = asyncHandler(async (req, res) => {
  const { schoolId, id: initiator } = req.user;
  const { id: invoiceId } = req.params;
  const { amount: refundAmount, method: refundMethod } = req.body;
  const response = await processRefundInvoice({
    invoiceId,
    refundAmount,
    schoolId,
    initiator,
    refundMethod,
  });
  res.json(response);
});

const handleDisputeInvoice = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: invoiceId } = req.params;
  const response = await processDisputeInvoice({
    invoiceId,
    schoolId,
  });
  res.json(response);
});

const handleResolveDisputeInvoice = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { status: newInvoiceStatus } = req.body;
  const { id: invoiceId } = req.params;
  const response = await processResolveDisputeInvoice({
    invoiceId,
    schoolId,
    newInvoiceStatus,
  });
  res.json(response);
});

const handleCancelInvoice = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: invoiceId } = req.params;
  const response = await processCancelInvoice({
    invoiceId,
    schoolId,
  });
  res.json(response);
});

const handleRemoveInvoiceItem = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: invoiceId, itemId: invoiceItemId } = req.params;
  const response = await processRemoveInvoiceItem({
    invoiceId,
    schoolId,
    invoiceItemId,
  });
  res.json(response);
});

module.exports = {
  handleGenerateInvoice,
  handleGetInvoiceById,
  handleGetAllInvoices,
  handlePayInvoice,
  handleRefundInvoice,
  handleDisputeInvoice,
  handleResolveDisputeInvoice,
  handleCancelInvoice,
  handleRemoveInvoiceItem,
};
