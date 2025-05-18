import asyncHandler from 'express-async-handler';
import {
  addClass,
  updateClassDetail,
  processGetClassesWithSections,
  processAddSection,
  processUpdateSection
} from './class-service.js';

export const handleAddClass = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await addClass({ ...payload, schoolId });
  res.json(response);
});

export const handleUpdateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const { schoolId } = req.user;
  const payload = { id, name, schoolId, status };
  const response = await updateClassDetail(payload);
  res.json(response);
});

export const handleGetClassesWithSections = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { academicLevelId } = req.query;
  const response = await processGetClassesWithSections({
    schoolId,
    academicLevelId
  });
  res.json(response);
});

export const handleAddSection = asyncHandler(async (req, res) => {
  const { id: classId } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await processAddSection({
    ...payload,
    schoolId,
    classId
  });
  res.json(response);
});

export const handleUpdateSection = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { sectionId, id: classId } = req.params;
  const { name, status } = req.body;
  const response = await processUpdateSection({
    schoolId,
    status,
    classId,
    name,
    sectionId
  });
  res.json(response);
});
