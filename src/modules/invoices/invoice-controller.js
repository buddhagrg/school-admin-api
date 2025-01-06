const expressAsyncHandler = require("express-async-handler");
const {
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
} = require("./invoice-service");

const handleAddInvoice = expressAsyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const message = await processAddInvoice({ ...payload, schoolId });
  res.json(message);
});

const handleUpdateInvoice = expressAsyncHandler(async (req, res) => {
  const payload = req.body;
  const { id: invoiceId } = req.params;
  const { schoolId } = req.user;
  const message = await processUpdateInvoice({
    ...payload,
    schoolId,
    invoiceId,
  });
  res.json(message);
});

const handleGetInvoiceById = expressAsyncHandler(async (req, res) => {
  const { id: invoiceId } = req.params;
  const { schoolId } = req.user;
  const invoice = await processGetInvoiceById({ invoiceId, schoolId });
  res.json(invoice);
});

const handleGetAllInvoices = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { invoiceNumber, status } = req.query;
  const data = await processGetAllInvoices({
    invoiceNumber,
    status,
    schoolId,
  });
  res.json({ data });
});

const handlePayInvoice = expressAsyncHandler(async (req, res) => {
  const { schoolId, id: initiator } = req.user;
  const { id: invoiceId } = req.params;
  const { amount: paymentAmount, method: paymentMethod } = req.body;
  const message = await processPayInvoice({
    invoiceId,
    paymentAmount,
    schoolId,
    initiator,
    paymentMethod,
  });
  res.json(message);
});

const handleRefundInvoice = expressAsyncHandler(async (req, res) => {
  const { schoolId, id: initiator } = req.user;
  const { id: invoiceId } = req.params;
  const { amount: refundAmount, method: refundMethod } = req.body;
  const message = await processRefundInvoice({
    invoiceId,
    refundAmount,
    schoolId,
    initiator,
    refundMethod,
  });
  res.json(message);
});

const handleDisputeInvoice = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: invoiceId } = req.params;
  const message = await processDisputeInvoice({
    invoiceId,
    schoolId,
  });
  res.json(message);
});

const handleResolveDisputeInvoice = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { status: newInvoiceStatus } = req.body;
  const { id: invoiceId } = req.params;
  const message = await processResolveDisputeInvoice({
    invoiceId,
    schoolId,
    newInvoiceStatus,
  });
  res.json(message);
});

const handleCancelInvoice = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: invoiceId } = req.params;
  const message = await processCancelInvoice({
    invoiceId,
    schoolId,
  });
  res.json(message);
});

const handleRemoveInvoiceItem = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: invoiceId, itemId: invoiceItemId } = req.params;
  const message = await processRemoveInvoiceItem({
    invoiceId,
    schoolId,
    invoiceItemId,
  });
  res.json(message);
});

module.exports = {
  handleAddInvoice,
  handleUpdateInvoice,
  handleGetInvoiceById,
  handleGetAllInvoices,
  handlePayInvoice,
  handleRefundInvoice,
  handleDisputeInvoice,
  handleResolveDisputeInvoice,
  handleCancelInvoice,
  handleRemoveInvoiceItem,
};
