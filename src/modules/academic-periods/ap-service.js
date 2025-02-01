const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  addPeriod,
  updatePeriod,
  deletePeriod,
  getAllPeriods,
  assignPeriodDates,
  updatePeriodOrder,
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
  console.log(result)
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

const processAssignPeriodDates = async (payload) => {
  const affectedRow = await assignPeriodDates(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to assign academic period dates");
  }
  return { message: "Academic Period dates assigned successfully" };
};

const processUpdatePeriodOrder = async (payload) => {
  const { periods } = payload;
  if (!Array.isArray(periods) || periods.length <= 0) {
    throw new ApiError(400, "Bad request");
  }

  const affectedRow = await updatePeriodOrder(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to manage period order");
  }

  return { message: "Period order updated successfully" };
};

module.exports = {
  processAddPeriod,
  processUpdatePeriod,
  processDeletePeriod,
  processGetAllPeriods,
  processAssignPeriodDates,
  processUpdatePeriodOrder,
};
