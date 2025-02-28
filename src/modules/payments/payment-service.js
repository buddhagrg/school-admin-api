const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils/api-error");
const {
  doGeneralPayment,
  getAllPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deactivatePaymentMethod,
} = require("./payment-repository");

const processDoGeneralPayment = async (payload) => {
  const affectedRow = await doGeneralPayment(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to do payment");
  }
  return { message: "Payment successfull" };
};

const processGetAllPaymentMethods = async (schoolId) => {
  const paymentMethods = await getAllPaymentMethods(schoolId);
  if (paymentMethods.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { paymentMethods };
};

const processAddPaymentMethod = async (payload) => {
  const affectedRow = await addPaymentMethod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add payment method");
  }
  return { message: "Payment methods added successfully" };
};

const processUpdatePaymentMethod = async (payload) => {
  const affectedRow = await updatePaymentMethod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update payment method");
  }
  return { message: "Payment methods updated successfully" };
};

const processDeactivatePaymentMethod = async (payload) => {
  const affectedRow = await deactivatePaymentMethod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to deactivate payment method");
  }
  return { message: "Payment methods deactivated successfully" };
};
module.exports = {
  processDoGeneralPayment,
  processGetAllPaymentMethods,
  processAddPaymentMethod,
  processUpdatePaymentMethod,
  processDeactivatePaymentMethod,
};
