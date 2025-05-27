import { assertRowCount, handleArryResponse, handleObjectResponse } from '../../utils/index.js';
import {
  addDeposit,
  getDeposit,
  updateDeposit,
  getDeposits,
  refundDeposit
} from './deposit-repository.js';
import { DEPOSIT_MESSAGES } from './deposit-messages.js';

export const processAddDeposit = async (payload) => {
  await assertRowCount(addDeposit(payload), DEPOSIT_MESSAGES.ADD_DEPOSIT_FAIL);
  return { message: DEPOSIT_MESSAGES.ADD_DEPOSIT_SUCCESS };
};

export const processUpdateDeposit = async (payload) => {
  await assertRowCount(updateDeposit(payload), DEPOSIT_MESSAGES.UPDATE_DEPOSIT_FAIL);
  return { message: DEPOSIT_MESSAGES.UPDATE_DEPOSIT_SUCCESS };
};

export const processRefundDeposit = async (payload) => {
  await assertRowCount(refundDeposit(payload), DEPOSIT_MESSAGES.REFUND_DEPOSIT_FAIL);
  return { message: DEPOSIT_MESSAGES.REFUND_DEPOSIT_SUCCESS };
};

export const processGetDeposit = async (payload) => {
  return handleObjectResponse(() => getDeposit(payload));
};

export const processGetDeposits = async (schoolId) => {
  return handleArryResponse(() => getDeposits(schoolId), 'deposits');
};
