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
  const students = await getStudentsForAttendance(payload);
  if (!students || students.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { students };
};

const processGetStaffsForAttendance = async (payload) => {
  const staffs = await getStaffsForAttendance(payload);
  if (!staffs || staffs.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { staffs };
};

const processAddOrUpdateAttendance = async (payload) => {
  const affectedRow = await addOrUpdateAttendance(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to manage student attendance");
  }
  return { message: "Student attendance managed successfully" };
};

const processGetStudentsAttendanceRecord = async (payload) => {
  let students = [];
  if (payload.attendanceType === "S") {
    students = await getStudentSubjectWiseAttendanceRecord(payload);
  } else if (payload.attendanceType === "D") {
    students = await getStudentDailyAttendanceRecord(payload);
  }
  if (!students || students.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { students };
};

const processGetStaffsAttendanceRecord = async (payload) => {
  const staffs = await getStaffsDailyAttendanceRecord(payload);
  if (!staffs || staffs.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { staffs };
};

module.exports = {
  processGetStudentsForAttendance,
  processAddOrUpdateAttendance,
  processGetStudentsAttendanceRecord,
  processGetStaffsForAttendance,
  processGetStaffsAttendanceRecord,
};
