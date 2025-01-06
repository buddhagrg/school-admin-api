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
  const message = await processAddDeposit({ ...payload, schoolId });
  res.json(message);
});

const handleGetDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;
  const deposit = await processGetDeposit({ schoolId, id });
  res.json(deposit);
});

const handleUpdateDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;
  const payload = req.body;
  const message = await processUpdateDeposit({ ...payload, schoolId, id });
  res.json(message);
});

const handleGetDeposits = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const message = await processGetDeposits(schoolId);
  res.json(message);
});

const handleRefundDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id } = req.params;
  const message = await processRefundDeposit({ ...payload, schoolId, id });
  res.json(message);
});

module.exports = {
  handleAddDeposit,
  handleGetDeposit,
  handleUpdateDeposit,
  handleGetDeposits,
  handleRefundDeposit,
};
