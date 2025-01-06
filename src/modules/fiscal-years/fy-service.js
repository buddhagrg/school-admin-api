const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  addFiscalYear,
  updateFiscalYear,
  getAllFiscalYears,
  activateFiscalYear,
} = require("./fy-repository");

const processAddFiscalYear = async (payload) => {
  const affectedRow = await addFiscalYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add fiscal year");
  }
  return { message: "Fiscal year added successfully" };
};

const processUpdateFiscalYear = async (payload) => {
  const affectedRow = await updateFiscalYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update fiscal year");
  }
  return { message: "Fiscal year updated successfully" };
};

const processGetAllFiscalYears = async (payload) => {
  const fiscalYears = await getAllFiscalYears(payload);
  if (fiscalYears.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return fiscalYears;
};

const processActivateFiscalYear = async (payload) => {
  const affectedRow = await activateFiscalYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to activate fiscal year");
  }
  return { message: "Fiscal year activated successfully" };
};

module.exports = {
  processAddFiscalYear,
  processUpdateFiscalYear,
  processGetAllFiscalYears,
  processActivateFiscalYear,
};
