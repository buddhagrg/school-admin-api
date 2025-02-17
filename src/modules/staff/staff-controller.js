const asyncHandler = require("express-async-handler");
const {
  processUpdateStaff,
  processGetAllStaff,
  processReviewStaffStatus,
  processGetStaff,
  processAddStaff,
} = require("./staff-service");

const handleGetAllStaff = asyncHandler(async (req, res) => {
  const { userId, roleId, name } = req.query;
  const { schoolId } = req.user;
  const response = await processGetAllStaff({
    userId,
    roleId,
    name,
    schoolId,
  });
  res.json(response);
});

const handleGetStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processGetStaff({ id, schoolId });
  res.json(response);
});

const handleReviewStaffStatus = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { id: userId } = req.params;
  const { id: reviewerId, schoolId } = req.user;
  const response = await processReviewStaffStatus({
    ...payload,
    userId,
    reviewerId,
    schoolId,
  });
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
  handleGetAllStaff,
  handleGetStaff,
  handleReviewStaffStatus,
  handleAddStaff,
  handleUpdateStaff,
};
