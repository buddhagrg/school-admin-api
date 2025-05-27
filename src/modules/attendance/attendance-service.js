import { assertRowCount, handleArryResponse, handleObjectResponse } from '../../utils/index.js';
import {
  getStudentsForAttendance,
  // getStudentSubjectWiseAttendanceRecord,
  getStudentDailyAttendanceRecord,
  recordAttendance,
  getStaffForAttendance,
  getStaffDailyAttendanceRecord,
  updateAttendanceStatus
} from './attendance-repository.js';
import { ATTENDANCE_MESSAGES } from './attendance-messages.js';

export const processGetStudentsForAttendance = async (payload) => {
  return handleArryResponse(() => getStudentsForAttendance(payload), 'students');
};

export const processGetStaffForAttendance = async (payload) => {
  return handleArryResponse(() => getStaffForAttendance(payload), 'staff');
};

export const processRecordAttendance = async (payload) => {
  await assertRowCount(recordAttendance(payload), ATTENDANCE_MESSAGES.RECORD_ATTENDANCE_FAIL);
  return { message: ATTENDANCE_MESSAGES.RECORD_ATTENDANCE_SUCCESS };
};

export const processGetStudentsAttendanceRecord = async (payload) => {
  return handleObjectResponse(() => getStudentDailyAttendanceRecord(payload));
};

export const processGetStaffAttendanceRecord = async (payload) => {
  return handleObjectResponse(() => getStaffDailyAttendanceRecord(payload));
};

export const processUpdateAttendanceStatus = async (payload) => {
  await assertRowCount(
    updateAttendanceStatus(payload),
    ATTENDANCE_MESSAGES.UPDATE_ATTENDANCE_STS_FAIL
  );
  return { message: ATTENDANCE_MESSAGES.UPDATE_ATTENDANCE_STS_SUCCESS };
};
