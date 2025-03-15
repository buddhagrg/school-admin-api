const asyncHandler = require("express-async-handler");
const {
  processGetStudentsForAttendance,
  processRecordAttendance,
  processGetStudentsAttendanceRecord,
  processGetStaffForAttendance,
  processGetStaffAttendanceRecord,
  processUpdateAttendanceStatus,
} = require("./attendance-service");

const handleGetStudentsForAttendance = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStudentsForAttendance({
    ...payload,
    schoolId,
  });
  res.json(response);
});

const handleGetStaffForAttendance = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStaffForAttendance({
    ...payload,
    schoolId,
  });
  res.json(response);
});

const handleRecordAttendance = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId, id: attendanceRecorder } = req.user;
  const response = await processRecordAttendance({
    ...payload,
    schoolId,
    attendanceRecorder,
  });
  res.json(response);
});

const handleGetStudentsAttendanceRecord = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStudentsAttendanceRecord({
    ...payload,
    schoolId,
  });
  res.json(response);
});

const handleGetStaffAttendanceRecord = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStaffAttendanceRecord({
    ...payload,
    schoolId,
  });
  res.json(response);
});

const handleUpdateAttendanceStatus = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const { id: attendanceId } = req.params;
  const response = await processUpdateAttendanceStatus({
    ...payload,
    schoolId,
    attendanceId,
  });
  res.json(response);
});

module.exports = {
  handleGetStudentsForAttendance,
  handleRecordAttendance,
  handleGetStudentsAttendanceRecord,
  handleGetStaffForAttendance,
  handleGetStaffAttendanceRecord,
  handleUpdateAttendanceStatus,
};
