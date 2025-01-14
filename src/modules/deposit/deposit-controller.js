const asyncHandler = require("express-async-handler");
const {
  processAddDeposit,
  processGetDeposit,
  processUpdateDeposit,
  processGetDeposits,
  processRefundDeposit,
} = require("./deposit-service");

const handleAddDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddDeposit({ ...payload, schoolId });
  res.json(response);
});

const handleGetDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;
  const response = await processGetDeposit({ schoolId, id });
  res.json(response);
});

const handleUpdateDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;
  const payload = req.body;
  const response = await processUpdateDeposit({ ...payload, schoolId, id });
  res.json(response);
});

const handleGetDeposits = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetDeposits(schoolId);
  res.json(response);
});

const handleRefundDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id } = req.params;
  const response = await processRefundDeposit({ ...payload, schoolId, id });
  res.json(response);
});

module.exports = {
  handleAddDeposit,
  handleGetDeposit,
  handleUpdateDeposit,
  handleGetDeposits,
  handleRefundDeposit,
};
