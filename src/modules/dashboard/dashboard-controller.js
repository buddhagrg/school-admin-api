const asyncHandler = require("express-async-handler");
const { fetchDashboardData } = require("./dashboard-service");

const handleGetDashboardData = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const response = await fetchDashboardData(userId);
  res.json(response);
});

module.exports = {
  handleGetDashboardData,
};
