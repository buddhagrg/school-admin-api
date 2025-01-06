const asyncHandler = require("express-async-handler");
const {
  processDoGeneralPayment,
  processGetAllPaymentMethods,
  processAddPaymentMethod,
  processUpdatePaymentMethod,
  processDeactivatePaymentMethod,
} = require("./payment-service");

const handleDoGeneralPayment = asyncHandler(async (req, res) => {
  const { schoolId, id: initiator } = req.user;
  const payload = req.body;
  const message = await processDoGeneralPayment({
    ...payload,
    schoolId,
    initiator,
  });
  res.json(message);
});

const handleGetAllPaymentMethods = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const data = await processGetAllPaymentMethods(schoolId);
  res.json({ data });
});

const handleAddPaymentMethod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const message = await processAddPaymentMethod({
    ...payload,
    schoolId,
  });
  res.json(message);
});

const handleUpdatePaymentMethod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: paymentMethodId } = req.params;
  const payload = req.body;
  const message = await processUpdatePaymentMethod({
    ...payload,
    schoolId,
    paymentMethodId,
  });
  res.json(message);
});

const handleDeactivatePaymentMethod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: paymentMethodId } = req.params;
  const message = await processDeactivatePaymentMethod({
    schoolId,
    paymentMethodId,
  });
  res.json(message);
});

module.exports = {
  handleDoGeneralPayment,
  handleGetAllPaymentMethods,
  handleAddPaymentMethod,
  handleUpdatePaymentMethod,
  handleDeactivatePaymentMethod,
};
