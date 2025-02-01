const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getAllLevels,
  updateLevel,
  addLevel,
  addClassToLevel,
  getAcademicLevelsWithPeriods,
} = require("./level-repository");

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
  const academicLevels = await getAllLevels(schoolId);
  if (academicLevels.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { academicLevels };
};

const processAddClassToLevel = async (payload) => {
  const affectedRow = await addClassToLevel(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add class to academic level");
  }
  return { message: "Class added to academic level successfully" };
};

const processGetAcademicLevelsWithPeriods = async (schoolId) => {
  const data = await getAcademicLevelsWithPeriods(schoolId);
  if (!data || data.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  const academicLevelsWithPeriods = formatResponse(data);
  return { academicLevelsWithPeriods };
};

const formatResponse = (data) =>
  Object.values(
    data.reduce((acc, item) => {
      const { id, name, academicLevelId, academicLevelName, orderId } = item;

      if (!acc[academicLevelId]) {
        acc[academicLevelId] = {
          id: academicLevelId,
          name: academicLevelName,
          periods: [],
        };
      }

      if (id && name) {
        acc[academicLevelId].periods.push({
          id,
          name,
          orderId,
        });
      }

      return acc;
    }, {})
  ).map((level) => {
    level.periods.sort((a, b) => a.orderId - b.orderId);
    return level;
  });

module.exports = {
  processAddLevel,
  processUpdateLevel,
  processGetLevels,
  processAddClassToLevel,
  processGetAcademicLevelsWithPeriods,
};
