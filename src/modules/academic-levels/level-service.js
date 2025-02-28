const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getAllLevels,
  updateLevel,
  addLevel,
  addClassToLevel,
  getAcademicLevelsWithPeriods,
  deleteLevel,
  getLevelsWithClasses,
  deleteLevelFromClass,
  reorderPeriods,
  getPeriodsDates,
  updatePeriodsDates,
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

const formatResponse = (data, type) =>
  Object.values(
    data.reduce((acc, item) => {
      const { id, name, academicLevelId, academicLevelName, sortOrder } = item;

      if (!acc[academicLevelId]) {
        acc[academicLevelId] = {
          id: academicLevelId,
          name: academicLevelName,
          [type]: [],
        };
      }

      if (id && name) {
        acc[academicLevelId][type].push({
          id,
          name,
          sortOrder,
        });
      }

      return acc;
    }, {})
  ).map((level) => {
    level[type].sort((a, b) => a.sortOrder - b.sortOrder);
    return level;
  });

const processGetAcademicLevelsWithPeriods = async (schoolId) => {
  const data = await getAcademicLevelsWithPeriods(schoolId);
  if (!data || data.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  const levelsWithPeriods = formatResponse(data, "periods");
  return { levelsWithPeriods };
};

const processDeleteLevel = async (payload) => {
  const affectedRow = await deleteLevel(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete academic level");
  }
  return { message: "Academic Level deleted successfully" };
};

const processGetLevelsWithClasses = async (schoolId) => {
  const data = await getLevelsWithClasses(schoolId);
  if (!data || data.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  const levelsWithClasses = formatResponse(data, "classes");
  return { levelsWithClasses };
};

const processDeleteLevelFromClass = async (payload) => {
  const affectedRow = await deleteLevelFromClass(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete class from academic-level");
  }
  return { message: "Class deleted successfuly from academic-level" };
};

const processReorderPeriods = async (payload) => {
  const { periods } = payload;
  if (!Array.isArray(periods) || periods.length <= 0) {
    throw new ApiError(400, "Bad request");
  }

  const affectedRow = await reorderPeriods(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to manage period order");
  }

  return { message: "Period order updated successfully" };
};

const processGetPeriodsDates = async (payload) => {
  const periodsWithDates = await getPeriodsDates(payload);
  if (!Array.isArray(periodsWithDates) || periodsWithDates.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { periodsWithDates };
};

const processUpdatePeriodsDates = async (payload) => {
  const affectedRow = await updatePeriodsDates(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update academic period dates");
  }
  return { message: "Academic Period dates updated successfully" };
};

module.exports = {
  processAddLevel,
  processUpdateLevel,
  processGetLevels,
  processAddClassToLevel,
  processGetAcademicLevelsWithPeriods,
  processDeleteLevel,
  processGetLevelsWithClasses,
  processDeleteLevelFromClass,
  processReorderPeriods,
  processGetPeriodsDates,
  processUpdatePeriodsDates,
};
