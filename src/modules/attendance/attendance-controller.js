const asyncHandler = require("express-async-handler");
const {
  processGetStudentsForAttendance,
  processAddOrUpdateAttendance,
  processGetStudentsAttendanceRecord,
  processGetStaffsForAttendance,
  processGetStaffsAttendanceRecord,
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

const handleGetStaffsForAttendance = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStaffsForAttendance({
    ...payload,
    schoolId,
  });
  res.json(response);
});

const handleAddOrUpdateAttendance = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId, id: attendanceRecorder } = req.user;
  const response = await processAddOrUpdateAttendance({
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

const handleGetStaffsAttendanceRecord = asyncHandler(async (req, res) => {
  const payload = req.query;
  const { schoolId } = req.user;
  const response = await processGetStaffsAttendanceRecord({
    ...payload,
    schoolId,
  });
  res.json(response);
});

module.exports = {
  handleGetStudentsForAttendance,
  handleAddOrUpdateAttendance,
  handleGetStudentsAttendanceRecord,
  handleGetStaffsForAttendance,
  handleGetStaffsAttendanceRecord,
};
