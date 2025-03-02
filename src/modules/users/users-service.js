const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getUsers,
  updateUserSystemAccess,
  switchUserRole,
} = require("./users-repository");

const processGetUsers = async (payload) => {
  const users = await getUsers(payload);
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { users };
};

const processUpdateUserSystemAccess = async (payload) => {
  if ([1, 2].includes(payload.staticRoleId)) {
    throw new ApiError(401, ERROR_MESSAGES.NOT_ALLOWED_IN_DEMO);
  }

  const affectedRow = await updateUserSystemAccess(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update user system access");
  }
  return { message: "User system access updated successfully" };
};

const processSwitchRole = async (payload) => {
  const affectedRow = await switchUserRole(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to switch user role");
  }
  return { message: "User role switched successfully" };
};

module.exports = {
  processGetUsers,
  processUpdateUserSystemAccess,
  processSwitchRole,
};
