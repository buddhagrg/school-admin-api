const asyncHandler = require("express-async-handler");
const {
  processUpdateStaff,
  processGetAllStaffs,
  processReviewStaffStatus,
  processGetStaff,
  processAddStaff,
} = require("./staffs-service");

const handleGetAllStaffs = asyncHandler(async (req, res) => {
  const { userId, roleId, name } = req.query;
  const { schoolId } = req.user;
  const data = await processGetAllStaffs({ userId, roleId, name, schoolId });
  res.json({ data });
});

const handleGetStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const staff = await processGetStaff({ id, schoolId });
  res.json(staff);
});

const handleReviewStaffStatus = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { id: userId } = req.params;
  const { id: reviewerId, schoolId } = req.user;
  const message = await processReviewStaffStatus({
    ...payload,
    userId,
    reviewerId,
    schoolId,
  });
  res.json(message);
});

const handleAddStaff = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const message = await processAddStaff({ ...payload, schoolId });
  res.json(message);
});

const handleUpdateStaff = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const message = await processUpdateStaff({ ...payload, userId, schoolId });
  res.json(message);
});

module.exports = {
  handleGetAllStaffs,
  handleGetStaff,
  handleReviewStaffStatus,
  handleAddStaff,
  handleUpdateStaff,
};
