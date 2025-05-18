import asyncHandler from 'express-async-handler';
import {
  processAddLevel,
  processUpdateLevel,
  processGetLevels,
  processDeleteLevel,
  processReorderPeriods,
  processGetPeriodsOfLevel,
  processAddPeriod,
  processUpdatePeriod,
  processDeletePeriod
} from './level-service.js';

export const handleAddLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddLevel({ ...payload, schoolId });
  res.json(response);
});

export const handleUpdateLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const payload = req.body;
  const response = await processUpdateLevel({
    ...payload,
    schoolId,
    academicLevelId
  });
  res.json(response);
});

export const handleGetLevels = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetLevels(schoolId);
  res.json(response);
});

export const handleDeleteLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const response = await processDeleteLevel({ schoolId, academicLevelId });
  res.json(response);
});

export const handleReorderPeriods = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const { periods } = req.body;
  const response = await processReorderPeriods({
    schoolId,
    periods,
    academicLevelId
  });
  res.json(response);
});

export const handleGetPeriodsOfLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const response = await processGetPeriodsOfLevel({
    schoolId,
    academicLevelId
  });
  res.json(response);
});

export const handleAddPeriod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const payload = req.body;
  const response = await processAddPeriod({
    ...payload,
    schoolId,
    academicLevelId
  });
  res.json(response);
});

export const handleUpdatePeriod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: academicLevelId, periodId: academicPeriodId } = req.params;
  const response = await processUpdatePeriod({
    ...payload,
    schoolId,
    academicLevelId,
    academicPeriodId
  });
  res.json(response);
});

export const handleDeletePeriod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { periodId: academicPeriodId, id: academicLevelId } = req.params;
  const response = await processDeletePeriod({
    schoolId,
    academicPeriodId,
    academicLevelId
  });
  res.json(response);
});
