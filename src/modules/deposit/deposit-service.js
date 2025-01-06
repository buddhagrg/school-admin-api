const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  addDeposit,
  getDeposit,
  updateDeposit,
  getDeposits,
  refundDeposit,
} = require("./deposit-repository");

const processAddDeposit = async (payload) => {
  const affectedRow = await addDeposit(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add deposit");
  }
  return { message: "Deposit added successfully" };
};

const processGetDeposit = async (payload) => {
  const deposit = await getDeposit(payload);
  if (!deposit) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return deposit;
};

const processUpdateDeposit = async (payload) => {
  const affectedRow = await updateDeposit(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update deposit");
  }
  return { message: "Deposit updated successfully" };
};

const processGetDeposits = async (schoolId) => {
  const deposits = await getDeposits(schoolId);
  if (deposits.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return deposits;
};

const processRefundDeposit = async (payload) => {
  const affectedRow = await refundDeposit(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to refund deposit");
  }
  return { message: "Deposit refunded successfully" };
};

module.exports = {
  processAddDeposit,
  processGetDeposit,
  processUpdateDeposit,
  processGetDeposits,
  processRefundDeposit,
};
