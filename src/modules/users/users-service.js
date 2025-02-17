const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const { getUsers } = require("./users-repository");

const processGetUsers = async (payload) => {
  const users = await getUsers(payload);
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { users };
};

module.exports = { processGetUsers };
