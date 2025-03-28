const asyncHandler = require("express-async-handler");
const {
  processContactUs,
  processGetDashboardData,
  processGetAllTeachersOfSchool,
} = require("./misc.service");

const handleContactUs = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processContactUs(payload);
  res.json(response);
});

const handleGetDashboardData = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const response = await processGetDashboardData(userId);
  res.json(response);
});

const handleGetAllTeachersOfSchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllTeachersOfSchool(schoolId);
  res.json(response);
});

module.exports = {
  handleContactUs,
  handleGetDashboardData,
  handleGetAllTeachersOfSchool,
};
