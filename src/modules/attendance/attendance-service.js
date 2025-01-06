const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getStudentsForAttendance,
  getStudentSubjectWiseAttendanceRecord,
  getStudentDailyAttendanceRecord,
  addOrUpdateAttendance,
  getStaffsForAttendance,
  getStaffsDailyAttendanceRecord,
} = require("./attendance-repository");

const processGetStudentsForAttendance = async (payload) => {
  const records = await getStudentsForAttendance(payload);
  if (records.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return records;
};

const processGetStaffsForAttendance = async (payload) => {
  const records = await getStaffsForAttendance(payload);
  if (records.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return records;
};

const processAddOrUpdateAttendance = async (payload) => {
  const affectedRow = await addOrUpdateAttendance(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to manage student attendance");
  }

  return { message: "Student attendance managed successfully" };
};

const processGetStudentsAttendanceRecord = async (payload) => {
  let records = [];
  if (payload.attendanceType === "S") {
    records = await getStudentSubjectWiseAttendanceRecord(payload);
  } else if (payload.attendanceType === "D") {
    students = await getStudentDailyAttendanceRecord(payload);
  }
  if (records.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return records;
};

const processGetStaffsAttendanceRecord = async (payload) => {
  const records = await getStaffsDailyAttendanceRecord(payload);
  if (records.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return records;
};

module.exports = {
  processGetStudentsForAttendance,
  processAddOrUpdateAttendance,
  processGetStudentsAttendanceRecord,
  processGetStaffsForAttendance,
  processGetStaffsAttendanceRecord,
};
