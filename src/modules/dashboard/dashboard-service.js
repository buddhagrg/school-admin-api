const { ERROR_MESSAGES } = require("../../constants");
const { getUserDashboardData } = require("./dashboard-repository");

const fetchDashboardData = async (userId) => {
  const data = await getUserDashboardData(userId);

  if (!data) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return data;
};

module.exports = {
  fetchDashboardData,
};
