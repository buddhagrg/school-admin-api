import asyncHandler from 'express-async-handler';
import {
  processGetAllClassTeachers,
  processAssignClassTeacher,
  processUpdateClassTeacher
} from './class-teachers.service.js';

export const handleGetAllClassTeachers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllClassTeachers(schoolId);
  res.json(response);
});

export const handleAssignClassTeacher = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { classId, teacherId } = req.body;
  const response = await processAssignClassTeacher({
    schoolId,
    classId,
    teacherId
  });
  res.json(response);
});

export const handleUpdateClassTeacher = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id, teacherId } = req.params;
  const response = await processUpdateClassTeacher({
    schoolId,
    id,
    teacherId
  });
  res.json(response);
});
