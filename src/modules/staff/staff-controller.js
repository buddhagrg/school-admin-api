const asyncHandler = require("express-async-handler");
const {
  processUpdateStaff,
  processGetStaff,
  processAddStaff,
} = require("./staff-service");

const handleGetStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processGetStaff({ id, schoolId });
  res.json(response);
});

const handleAddStaff = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await processAddStaff({ ...payload, schoolId });
  res.json(response);
});

const handleUpdateStaff = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateStaff({ ...payload, userId, schoolId });
  res.json(response);
});

module.exports = {
  handleGetStaff,
  handleAddStaff,
  handleUpdateStaff,
};
