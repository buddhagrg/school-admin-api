import asyncHandler from 'express-async-handler';
import {
  processDoGeneralPayment,
  processGetAllPaymentMethods,
  processAddPaymentMethod,
  processUpdatePaymentMethod,
  processDeactivatePaymentMethod
} from './payment-service.js';

export const handleDoGeneralPayment = asyncHandler(async (req, res) => {
  const { schoolId, userId: initiator } = req.user;
  const payload = req.body;
  const response = await processDoGeneralPayment({
    ...payload,
    schoolId,
    initiator
  });
  res.json(response);
});

export const handleGetAllPaymentMethods = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllPaymentMethods(schoolId);
  res.json(response);
});

export const handleAddPaymentMethod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddPaymentMethod({
    ...payload,
    schoolId
  });
  res.json(response);
});

export const handleUpdatePaymentMethod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: paymentMethodId } = req.params;
  const payload = req.body;
  const response = await processUpdatePaymentMethod({
    ...payload,
    schoolId,
    paymentMethodId
  });
  res.json(response);
});

export const handleDeactivatePaymentMethod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: paymentMethodId } = req.params;
  const response = await processDeactivatePaymentMethod({
    schoolId,
    paymentMethodId
  });
  res.json(response);
});
