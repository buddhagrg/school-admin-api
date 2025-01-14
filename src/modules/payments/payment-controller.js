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
  const response = await processDoGeneralPayment({
    ...payload,
    schoolId,
    initiator,
  });
  res.json(response);
});

const handleGetAllPaymentMethods = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllPaymentMethods(schoolId);
  res.json(response);
});

const handleAddPaymentMethod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddPaymentMethod({
    ...payload,
    schoolId,
  });
  res.json(response);
});

const handleUpdatePaymentMethod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: paymentMethodId } = req.params;
  const payload = req.body;
  const response = await processUpdatePaymentMethod({
    ...payload,
    schoolId,
    paymentMethodId,
  });
  res.json(response);
});

const handleDeactivatePaymentMethod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: paymentMethodId } = req.params;
  const response = await processDeactivatePaymentMethod({
    schoolId,
    paymentMethodId,
  });
  res.json(response);
});

module.exports = {
  handleDoGeneralPayment,
  handleGetAllPaymentMethods,
  handleAddPaymentMethod,
  handleUpdatePaymentMethod,
  handleDeactivatePaymentMethod,
};
