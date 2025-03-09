const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getStudentsForAttendance,
  getStudentSubjectWiseAttendanceRecord,
  getStudentDailyAttendanceRecord,
  recordAttendance,
  getStaffForAttendance,
  getStaffDailyAttendanceRecord,
} = require("./attendance-repository");

const processGetStudentsForAttendance = async (payload) => {
  const students = await getStudentsForAttendance(payload);
  if (!students || students.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { students };
};

const processGetStaffForAttendance = async (payload) => {
  const staff = await getStaffForAttendance(payload);
  if (!staff || staff.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { staff };
};

const processRecordAttendance = async (payload) => {
  const affectedRow = await recordAttendance(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to record user attendance");
  }
  return { message: "User attendance recorded successfully" };
};

const processGetStudentsAttendanceRecord = async (payload) => {
  let students = [];
  if (payload.attendanceType === "S") {
    students = await getStudentSubjectWiseAttendanceRecord(payload);
  } else if (payload.attendanceType === "D") {
    students = await getStudentDailyAttendanceRecord(payload);
  }
  if (!students || students.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { students };
};

const processGetStaffAttendanceRecord = async (payload) => {
  const staff = await getStaffDailyAttendanceRecord(payload);
  if (!staff || staff.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { staff };
};

module.exports = {
  processGetStudentsForAttendance,
  processRecordAttendance,
  processGetStudentsAttendanceRecord,
  processGetStaffForAttendance,
  processGetStaffAttendanceRecord,
};
