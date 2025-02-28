const { ApiError } = require("../../utils");
const { addPeriod, updatePeriod, deletePeriod } = require("./ap-repository");

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

module.exports = {
  processAddPeriod,
  processUpdatePeriod,
  processDeletePeriod,
};
