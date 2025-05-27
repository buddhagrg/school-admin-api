import asyncHandler from 'express-async-handler';
import {
  processUpdateStaff,
  processGetStaffDetail,
  processAddStaff,
  processGetAllStaff,
  processUpdateStaffStatus
} from './staff-service.js';

export const handleGetAllStaff = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllStaff(schoolId);
  res.json(response);
});

export const handleGetStaffDetail = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { mode } = req.query;
  const { schoolId } = req.user;
  const response = await processGetStaffDetail({ userId, schoolId, mode });
  res.json(response);
});

export const handleAddStaff = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await processAddStaff({ ...payload, schoolId });
  res.json(response);
});

export const handleUpdateStaff = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateStaff({ ...payload, userId, schoolId });
  res.json(response);
});

export const handleUpdateStaffStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { hasSystemAccess } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateStaffStatus({ hasSystemAccess, userId, schoolId });
  res.json(response);
});
