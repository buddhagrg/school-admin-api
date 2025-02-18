const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const { getUsers, updateUserSystemAccess } = require("./users-repository");

const processGetUsers = async (payload) => {
  const users = await getUsers(payload);
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { users };
};

const processUpdateUserSystemAccess = async (paylaod) => {
  const affectedRow = await updateUserSystemAccess(paylaod);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update user system access");
  }
  return { message: "User system access updated successfully" };
};

module.exports = { processGetUsers, processUpdateUserSystemAccess };
