import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  doGeneralPayment,
  getAllPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deactivatePaymentMethod
} from './payment-repository.js';

export const processDoGeneralPayment = async (payload) => {
  const affectedRow = await doGeneralPayment(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to do payment');
  }
  return { message: 'Payment successfull' };
};

export const processGetAllPaymentMethods = async (schoolId) => {
  const paymentMethods = await getAllPaymentMethods(schoolId);
  if (paymentMethods.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { paymentMethods };
};

export const processAddPaymentMethod = async (payload) => {
  const affectedRow = await addPaymentMethod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add payment method');
  }
  return { message: 'Payment methods added successfully' };
};

export const processUpdatePaymentMethod = async (payload) => {
  const affectedRow = await updatePaymentMethod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update payment method');
  }
  return { message: 'Payment methods updated successfully' };
};

export const processDeactivatePaymentMethod = async (payload) => {
  const affectedRow = await deactivatePaymentMethod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to deactivate payment method');
  }
  return { message: 'Payment methods deactivated successfully' };
};
