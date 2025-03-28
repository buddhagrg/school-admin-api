const { ApiError } = require("../../utils");
const {
  contactUs,
  getDashboardData,
  getAllTeachersOfSchool,
} = require("./misc.repository");

const processContactUs = async (payload) => {
  const affectedRow = await contactUs(payload);
  if (affectedRow <= 0) {
    throw new ApiError(
      500,
      "Message couldn't be sent. Please try again later."
    );
  }
  return { message: "Your message has been sent successfully." };
};

const processGetDashboardData = async (userId) => {
  const data = await getDashboardData(userId);

  if (!data) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }

  return data;
};

const processGetAllTeachersOfSchool = async (schoolId) => {
  const teachers = await getAllTeachersOfSchool(schoolId);
  if (!Array.isArray(teachers) || teachers.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { teachers };
};

module.exports = {
  processContactUs,
  processGetDashboardData,
  processGetAllTeachersOfSchool,
};
