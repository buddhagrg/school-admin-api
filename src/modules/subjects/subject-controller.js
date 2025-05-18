import asyncHandler from 'express-async-handler';
import {
  processAddSubject,
  processUpdateSubject,
  processDeleteSubject,
  processGetAllSubjects
} from './subject-service.js';

export const handleAddSubject = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddSubject({ ...payload, schoolId });
  res.json(response);
});

export const handleUpdateSubject = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processUpdateSubject({ ...payload, schoolId });
  res.json(response);
});

export const handleDeleteSubject = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processDeleteSubject({ ...payload, schoolId });
  res.json(response);
});

export const handleGetAllSubjects = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processGetAllSubjects({ ...payload, schoolId });
  res.json(response);
});
