import asyncHandler from 'express-async-handler';
import {
  processGetAllAcademicYears,
  processAddAcademicYear,
  processUpdateAcademicYear
} from './academic-year-service.js';

export const handleGetAllAcademicYears = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllAcademicYears(schoolId);
  res.json(response);
});

export const handleAddAcademicYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddAcademicYear({ ...payload, schoolId });
  res.json(response);
});

export const handleUpdatelAcademicYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicYearId } = req.params;
  const payload = req.body;
  const response = await processUpdateAcademicYear({
    ...payload,
    schoolId,
    academicYearId
  });
  res.json(response);
});
