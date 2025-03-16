const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getStudentsForAttendance,
  getStudentSubjectWiseAttendanceRecord,
  getStudentDailyAttendanceRecord,
  recordAttendance,
  getStaffForAttendance,
  getStaffDailyAttendanceRecord,
  updateAttendanceStatus,
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
  let data = [];
  data = await getStudentDailyAttendanceRecord(payload);
  // if (payload.attendanceType === "S") {
  //   data = await getStudentSubjectWiseAttendanceRecord(payload);
  // } else if (payload.attendanceType === "D") {
  //   data = await getStudentDailyAttendanceRecord(payload);
  // }
  if (!data) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return data;
};

const processGetStaffAttendanceRecord = async (payload) => {
  const data = await getStaffDailyAttendanceRecord(payload);
  if (!data) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return data;
};

const processUpdateAttendanceStatus = async (payload) => {
  const affectedRow = await updateAttendanceStatus(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update attendance status");
  }
  return { message: "Attendance status updated successfully" };
};

module.exports = {
  processGetStudentsForAttendance,
  processRecordAttendance,
  processGetStudentsAttendanceRecord,
  processGetStaffForAttendance,
  processGetStaffAttendanceRecord,
  processUpdateAttendanceStatus,
};
