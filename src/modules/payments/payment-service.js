import { assertRowCount, handleArryResponse } from '../../utils/index.js';
import {
  doGeneralPayment,
  getAllPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deactivatePaymentMethod
} from './payment-repository.js';
import { PAYMENT_MESSAGES } from './payment-messages.js';

export const processGetAllPaymentMethods = async (schoolId) => {
  return handleArryResponse(() => getAllPaymentMethods(schoolId), 'paymentMethods');
};

export const processDoGeneralPayment = async (payload) => {
  await assertRowCount(doGeneralPayment(payload), PAYMENT_MESSAGES.PAYMENT_FAIL);
  return { message: PAYMENT_MESSAGES.PAYMENT_SUCCESS };
};

export const processAddPaymentMethod = async (payload) => {
  await assertRowCount(addPaymentMethod(payload), PAYMENT_MESSAGES.ADD_METHOD_FAIL);
  return { message: PAYMENT_MESSAGES.ADD_METHOD_SUCCESS };
};

export const processUpdatePaymentMethod = async (payload) => {
  await assertRowCount(updatePaymentMethod(payload), PAYMENT_MESSAGES.UPDATE_METHOD_FAIL);
  return { message: PAYMENT_MESSAGES.UPDATE_METHOD_SUCCESS };
};

export const processDeactivatePaymentMethod = async (payload) => {
  await assertRowCount(deactivatePaymentMethod(payload), PAYMENT_MESSAGES.DEACTIVATE_METHOD_FAIL);
  return { message: PAYMENT_MESSAGES.DEACTIVATE_METHOD_SUCCESS };
};
