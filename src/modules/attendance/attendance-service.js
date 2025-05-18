import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  getStudentsForAttendance,
  // getStudentSubjectWiseAttendanceRecord,
  getStudentDailyAttendanceRecord,
  recordAttendance,
  getStaffForAttendance,
  getStaffDailyAttendanceRecord,
  updateAttendanceStatus
} from './attendance-repository.js';

export const processGetStudentsForAttendance = async (payload) => {
  const students = await getStudentsForAttendance(payload);
  if (!students || students.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { students };
};

export const processGetStaffForAttendance = async (payload) => {
  const staff = await getStaffForAttendance(payload);
  if (!staff || staff.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { staff };
};

export const processRecordAttendance = async (payload) => {
  const affectedRow = await recordAttendance(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to record user attendance');
  }
  return { message: 'User attendance recorded successfully' };
};

export const processGetStudentsAttendanceRecord = async (payload) => {
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

export const processGetStaffAttendanceRecord = async (payload) => {
  const data = await getStaffDailyAttendanceRecord(payload);
  if (!data) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return data;
};

export const processUpdateAttendanceStatus = async (payload) => {
  const affectedRow = await updateAttendanceStatus(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update attendance status');
  }
  return { message: 'Attendance status updated successfully' };
};
