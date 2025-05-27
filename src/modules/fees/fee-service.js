import { assertFunctionResult, assertRowCount, handleArryResponse } from '../../utils/index.js';
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
import { FEE_MESSAGES } from './fee-messages.js';

export const processAddFee = async (payload) => {
  await assertRowCount(addFee(payload), FEE_MESSAGES.ADD_FEE_FAIL);
  return { message: FEE_MESSAGES.ADD_FEE_SUCCESS };
};

export const processUpdateFee = async (payload) => {
  await assertRowCount(updateFee(payload), FEE_MESSAGES.UPDATE_FEE_FAIL);
  return { message: FEE_MESSAGES.UPDATE_FEE_SUCCESS };
};

export const processDeleteFeeAssignedToStudent = async (payload) => {
  await assertRowCount(deleteFeeAssignedToStudent(payload), FEE_MESSAGES.DELETE_FEE_ASSIGNED_FAIL);
  return { message: FEE_MESSAGES.DELETE_FEE_ASSIGNED_SUCCESS };
};

export const processAddOrUpdateFeeStructures = async (payload) => {
  await assertRowCount(addOrUpdateFeeStructures(payload), FEE_MESSAGES.FEE_STR_FAIL);
  return { message: FEE_MESSAGES.FEE_STR_SUCCESS };
};

export const processGetAllFees = async (schoolId) => {
  return handleArryResponse(() => getAllFees(schoolId), 'fees');
};

export const processGetAllFeeStructures = async (payload) => {
  return handleArryResponse(() => getAllFeeStructures(payload), 'feeStructures');
};

export const processAssignFeeToStudent = async (payload) => {
  const result = await assertFunctionResult(assignFeeToStudent(payload));
  return { message: result.message };
};

export const processGetFeesAssignedToStudent = async (payload) => {
  return handleArryResponse(() => getFeesAssignedToStudent(payload), 'feesAssigned');
};
