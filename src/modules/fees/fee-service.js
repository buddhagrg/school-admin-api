const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils/api-error");
const {
  addFee,
  updateFee,
  assignFeeToStudent,
  getFeesAssignedToStudent,
  deleteFeeAssignedToStudent,
  getAllFees,
  getAllFeeStructures,
  addOrUpdateFeeStructures,
} = require("./fee-repository");

const processAddFee = async (payload) => {
  const affectedRow = await addFee(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add fee");
  }
  return { message: "Fee added successfully" };
};

const processUpdateFee = async (payload) => {
  const affectedRow = await updateFee(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update fee");
  }
  return { message: "Fee updated successfully" };
};

const processGetAllFees = async (schoolId) => {
  const fees = await getAllFees(schoolId);
  if (!fees || fees.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { fees };
};

const processAddOrUpdateFeeStructures = async (payload) => {
  const affectedRow = await addOrUpdateFeeStructures(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to modify fee structures");
  }
  return { message: "Fee structures modified successfully" };
};

const processGetAllFeeStructures = async (payload) => {
  const feeStructures = await getAllFeeStructures(payload);
  if (feeStructures.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { feeStructures };
};

const processAssignFeeToStudent = async (payload) => {
  const result = await assignFeeToStudent(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};

const processGetFeesAssignedToStudent = async (payload) => {
  const feesAssigned = await getFeesAssignedToStudent(payload);
  if (feesAssigned.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { feesAssigned };
};

const processDeleteFeeAssignedToStudent = async (payload) => {
  const affectedRow = await deleteFeeAssignedToStudent(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete fee assigned to student");
  }
  return { message: "Fee assigned to student deleted successfully" };
};

module.exports = {
  processAddFee,
  processUpdateFee,
  processGetAllFees,
  processAddOrUpdateFeeStructures,
  processGetAllFeeStructures,
  processAssignFeeToStudent,
  processGetFeesAssignedToStudent,
  processDeleteFeeAssignedToStudent,
};
