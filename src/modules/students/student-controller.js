import asyncHandler from 'express-async-handler';
import {
  addNewStudent,
  processGetStudentDetail,
  updateStudent,
  processGetStudentDueFees,
  processGetStudents,
  processUpdateStudentStatus
} from './student-service.js';

export const handleAddStudent = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await addNewStudent({ ...payload, schoolId });
  res.json(response);
});

export const handleUpdateStudent = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await updateStudent({ ...payload, userId, schoolId });
  res.json(response);
});

export const handleGetStudentDetail = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { mode } = req.query;
  const { schoolId } = req.user;
  const response = await processGetStudentDetail({ userId, schoolId, mode });
  res.json(response);
});

export const handleGetStudentDueFees = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { academicYearId, studentId } = req.query;
  const response = await processGetStudentDueFees({
    schoolId,
    academicYearId,
    studentId
  });
  res.json(response);
});

export const handleGetStudents = asyncHandler(async (req, res) => {
  const { classId, sectionId, name } = req.query;
  const { schoolId } = req.user;
  const response = await processGetStudents({
    classId,
    sectionId,
    name,
    schoolId
  });
  res.json(response);
});

export const handleUpdateStudentStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { hasSystemAccess } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateStudentStatus({ hasSystemAccess, userId, schoolId });
  res.json(response);
});
