const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const { getAllLevels, updateLevel, addLevel } = require("./level-repository");

const processAddLevel = async (payload) => {
  const affectedRow = await addLevel(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unabel to add school level");
  }
  return { message: "School level added successfully" };
};

const processUpdateLevel = async (payload) => {
  const affectedRow = await updateLevel(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unabel to updated school level");
  }
  return { message: "School level updated successfully" };
};

const processGetLevels = async (schoolId) => {
  const levels = await getAllLevels(schoolId);
  if (levels.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return levels;
};

module.exports = {
  processAddLevel,
  processUpdateLevel,
  processGetLevels,
};
