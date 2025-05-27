import asyncHandler from 'express-async-handler';
import {
  processGetAllSchools,
  processGetSchool,
  processUpdateSchool,
  processDeleteSchool,
  processGetMySchool,
  processUpdateMySchool
} from './school-service.js';

export const handleGetAllSchools = asyncHandler(async (req, res) => {
  const response = await processGetAllSchools();
  res.json(response);
});

export const handleGetSchool = asyncHandler(async (req, res) => {
  const { id: schoolId } = req.params;
  const response = await processGetSchool(schoolId);
  res.json(response);
});

export const handleUpdateSchool = asyncHandler(async (req, res) => {
  const { id: schoolId } = req.params;
  const payload = await req.body;
  const { userId } = req.user;
  const response = await processUpdateSchool({ ...payload, userId, schoolId });
  res.json(response);
});

export const handleDeleteSchool = asyncHandler(async (req, res) => {
  const { id: schoolId } = req.params;
  const response = await processDeleteSchool(schoolId);
  res.json(response);
});

export const handleGetMySchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetMySchool(schoolId);
  res.json(response);
});

export const handleUpdateMySchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processUpdateMySchool({
    ...payload,
    schoolId
  });
  res.json(response);
});
