const { getUserDashboardData } = require("./dashboard-repository");

const fetchDashboardData = async (userId) => {
  const data = await getUserDashboardData(userId);

  if (!data) {
    throw new ApiError(404, "Dashboard data not found");
  }

  return data;
};

module.exports = {
  fetchDashboardData,
};
