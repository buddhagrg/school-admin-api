import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  addFee,
  updateFee,
  assignFeeToStudent,
  getFeesAssignedToStudent,
  deleteFeeAssignedToStudent,
  getAllFees,
  getAllFeeStructures,
  addOrUpdateFeeStructures
} from './fee-repository.js';

export const processAddFee = async (payload) => {
  const affectedRow = await addFee(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add fee');
  }
  return { message: 'Fee added successfully' };
};

export const processUpdateFee = async (payload) => {
  const affectedRow = await updateFee(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update fee');
  }
  return { message: 'Fee updated successfully' };
};

export const processGetAllFees = async (schoolId) => {
  const fees = await getAllFees(schoolId);
  if (!fees || fees.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { fees };
};

export const processAddOrUpdateFeeStructures = async (payload) => {
  const affectedRow = await addOrUpdateFeeStructures(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to modify fee structures');
  }
  return { message: 'Fee structures modified successfully' };
};

export const processGetAllFeeStructures = async (payload) => {
  const feeStructures = await getAllFeeStructures(payload);
  if (feeStructures.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { feeStructures };
};

export const processAssignFeeToStudent = async (payload) => {
  const result = await assignFeeToStudent(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};

export const processGetFeesAssignedToStudent = async (payload) => {
  const feesAssigned = await getFeesAssignedToStudent(payload);
  if (feesAssigned.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { feesAssigned };
};

export const processDeleteFeeAssignedToStudent = async (payload) => {
  const affectedRow = await deleteFeeAssignedToStudent(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to delete fee assigned to student');
  }
  return { message: 'Fee assigned to student deleted successfully' };
};
