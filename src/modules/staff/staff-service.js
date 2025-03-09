const { ERROR_MESSAGES } = require("../../constants");
const { ApiError, sendAccountVerificationEmail } = require("../../utils");
const {
  addOrUpdateStaff,
  getStaffDetailById,
  getStaff,
} = require("./staff-repository");

const processGetStaff = async (schoolId) => {
  const staff = await getStaff(schoolId);
  if (!staff || staff.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }

  return { staff };
};
const processGetStaffDetail = async (payload) => {
  const staff = await getStaffDetailById(payload);
  if (!staff) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return staff;
};

const processAddStaff = async (payload) => {
  const ADD_STAFF_SUCCESS = "Staff added successfully.";
  const ADD_STAFF_AND_EMAIL_SEND_SUCCESS =
    "Staff added and verification email sent successfully.";
  const ADD_STAFF_AND_BUT_EMAIL_SEND_FAIL =
    "Staff added, but failed to send verification email.";
  try {
    const result = await addOrUpdateStaff(payload);
    if (!result.status) {
      throw new ApiError(500, result.message);
    }

    if (!payload.hasSystemAccess) {
      return { message: ADD_STAFF_SUCCESS };
    }

    try {
      await sendAccountVerificationEmail({
        userId: result.userId,
        userEmail: payload.email,
      });
      return { message: ADD_STAFF_AND_EMAIL_SEND_SUCCESS };
    } catch (error) {
      return { message: ADD_STAFF_AND_BUT_EMAIL_SEND_FAIL };
    }
  } catch (error) {
    throw new ApiError(500, "Unable to add staff");
  }
};

const processUpdateStaff = async (payload) => {
  const result = await addOrUpdateStaff(payload);
  if (!result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};

module.exports = {
  processGetStaff,
  processGetStaffDetail,
  processAddStaff,
  processUpdateStaff,
};
