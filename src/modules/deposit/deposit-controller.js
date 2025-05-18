import asyncHandler from 'express-async-handler';
import {
  processAddDeposit,
  processGetDeposit,
  processUpdateDeposit,
  processGetDeposits,
  processRefundDeposit
} from './deposit-service.js';

export const handleAddDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddDeposit({ ...payload, schoolId });
  res.json(response);
});

export const handleGetDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;
  const response = await processGetDeposit({ schoolId, id });
  res.json(response);
});

export const handleUpdateDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;
  const payload = req.body;
  const response = await processUpdateDeposit({ ...payload, schoolId, id });
  res.json(response);
});

export const handleGetDeposits = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetDeposits(schoolId);
  res.json(response);
});

export const handleRefundDeposit = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id } = req.params;
  const response = await processRefundDeposit({ ...payload, schoolId, id });
  res.json(response);
});
