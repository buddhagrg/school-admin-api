import asyncHandler from 'express-async-handler';
import {
  processGetStudentsForAttendance,
  processRecordAttendance,
  processGetStudentsAttendanceRecord,
  processGetStaffForAttendance,
  processGetStaffAttendanceRecord,
  processUpdateAttendanceStatus
} from './attendance-service.js';

export const handleGetStudentsForAttendance = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStudentsForAttendance({
    ...payload,
    schoolId
  });
  res.json(response);
});

export const handleGetStaffForAttendance = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStaffForAttendance({
    ...payload,
    schoolId
  });
  res.json(response);
});

export const handleRecordAttendance = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId, userId: attendanceRecorder } = req.user;
  const response = await processRecordAttendance({
    ...payload,
    schoolId,
    attendanceRecorder
  });
  res.json(response);
});

export const handleGetStudentsAttendanceRecord = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStudentsAttendanceRecord({
    ...payload,
    schoolId
  });
  res.json(response);
});

export const handleGetStaffAttendanceRecord = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStaffAttendanceRecord({
    ...payload,
    schoolId
  });
  res.json(response);
});

export const handleUpdateAttendanceStatus = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const { id: attendanceId } = req.params;
  const response = await processUpdateAttendanceStatus({
    ...payload,
    schoolId,
    attendanceId
  });
  res.json(response);
});
