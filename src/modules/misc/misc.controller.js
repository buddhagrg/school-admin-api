import asyncHandler from 'express-async-handler';
import {
  processContactUs,
  processGetDashboardData,
  processGetAllTeachersOfSchool
} from './misc.service.js';

export const handleContactUs = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processContactUs(payload);
  res.json(response);
});

export const handleGetDashboardData = asyncHandler(async (req, res) => {
  const { userId, staticRole, schoolId } = req.user;
  const response = await processGetDashboardData({
    userId,
    staticRole,
    schoolId
  });
  res.json(response);
});

export const handleGetAllTeachersOfSchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllTeachersOfSchool(schoolId);
  res.json(response);
});
