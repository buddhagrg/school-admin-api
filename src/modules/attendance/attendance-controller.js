const asyncHandler = require("express-async-handler");
const {
  processGetStudentsForAttendance,
  processRecordAttendance,
  processGetStudentsAttendanceRecord,
  processGetStaffForAttendance,
  processGetStaffAttendanceRecord,
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
  const { attendances } = req.body;
  const { schoolId, id: attendanceRecorder } = req.user;
  const response = await processRecordAttendance({
    attendances,
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

module.exports = {
  handleGetStudentsForAttendance,
  handleRecordAttendance,
  handleGetStudentsAttendanceRecord,
  handleGetStaffForAttendance,
  handleGetStaffAttendanceRecord,
};
