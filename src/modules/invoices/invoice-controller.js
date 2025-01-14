const expressAsyncHandler = require("express-async-handler");
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

const handleGenerateInvoice = expressAsyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await processGenerateInvoice({ ...payload, schoolId });
  res.json(response);
});

const handleGetInvoiceById = expressAsyncHandler(async (req, res) => {
  const { id: invoiceId } = req.params;
  const { schoolId } = req.user;
  const response = await processGetInvoiceById({ invoiceId, schoolId });
  res.json(response);
});

const handleGetAllInvoices = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { invoiceNumber, status } = req.query;
  const response = await processGetAllInvoices({
    invoiceNumber,
    status,
    schoolId,
  });
  res.json(response);
});

const handlePayInvoice = expressAsyncHandler(async (req, res) => {
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

const handleRefundInvoice = expressAsyncHandler(async (req, res) => {
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

const handleDisputeInvoice = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: invoiceId } = req.params;
  const response = await processDisputeInvoice({
    invoiceId,
    schoolId,
  });
  res.json(response);
});

const handleResolveDisputeInvoice = expressAsyncHandler(async (req, res) => {
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

const handleCancelInvoice = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: invoiceId } = req.params;
  const response = await processCancelInvoice({
    invoiceId,
    schoolId,
  });
  res.json(response);
});

const handleRemoveInvoiceItem = expressAsyncHandler(async (req, res) => {
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
