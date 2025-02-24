const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  addPeriod,
  updatePeriod,
  deletePeriod,
  getAllPeriods,
  getAllPeriodDates,
  definePeriodsDates,
} = require("./ap-repository");

const processAddPeriod = async (payload) => {
  const affectedRow = await addPeriod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add academic period");
  }
  return { message: "Academic Period added successfully" };
};

const processUpdatePeriod = async (payload) => {
  const affectedRow = await updatePeriod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update academic period");
  }
  return { message: "Academic Period updated successfully" };
};

const processDeletePeriod = async (payload) => {
  const result = await deletePeriod(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }

  return { message: result.message };
};

const processGetAllPeriods = async (schoolId) => {
  const academicPeriods = await getAllPeriods(schoolId);
  if (!academicPeriods || academicPeriods.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { academicPeriods };
};

const processGetAllPeriodDates = async (schoolId) => {
  const periodDates = await getAllPeriodDates(schoolId);
  if (!periodDates || periodDates.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { periodDates };
};

const processDefinePeriodsDates = async (payload) => {
  const affectedRow = await definePeriodsDates(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to define academic period dates");
  }
  return { message: "Academic Period dates defined successfully" };
};

module.exports = {
  processAddPeriod,
  processUpdatePeriod,
  processDeletePeriod,
  processGetAllPeriods,
  processGetAllPeriodDates,
  processDefinePeriodsDates,
};
