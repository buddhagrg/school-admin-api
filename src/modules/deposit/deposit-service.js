import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  addDeposit,
  getDeposit,
  updateDeposit,
  getDeposits,
  refundDeposit
} from './deposit-repository.js';

export const processAddDeposit = async (payload) => {
  const affectedRow = await addDeposit(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add deposit');
  }
  return { message: 'Deposit added successfully' };
};

export const processGetDeposit = async (payload) => {
  const deposit = await getDeposit(payload);
  if (!deposit) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return deposit;
};

export const processUpdateDeposit = async (payload) => {
  const affectedRow = await updateDeposit(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update deposit');
  }
  return { message: 'Deposit updated successfully' };
};

export const processGetDeposits = async (schoolId) => {
  const deposits = await getDeposits(schoolId);
  if (deposits.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return deposits;
};

export const processRefundDeposit = async (payload) => {
  const affectedRow = await refundDeposit(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to refund deposit');
  }
  return { message: 'Deposit refunded successfully' };
};
