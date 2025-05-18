import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError, sendAccountVerificationEmail } from '../../utils/index.js';
import {
  addOrUpdateStaff,
  getStaffDetailForView,
  getAllStaff,
  getStaffDetailForEdit
} from './staff-repository.js';

export const processGetAllStaff = async (schoolId) => {
  const staff = await getAllStaff(schoolId);
  if (!staff || staff.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { staff };
};

export const processGetStaffDetail = async (payload) => {
  const { mode } = payload;
  let staff = null;
  if (mode === 'view') {
    staff = await getStaffDetailForView(payload);
  } else if (mode === 'edit') {
    staff = await getStaffDetailForEdit(payload);
  }
  if (!staff) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return staff;
};

export const processAddStaff = async (payload) => {
  const ADD_STAFF_SUCCESS = 'Staff added successfully.';
  const ADD_STAFF_AND_EMAIL_SEND_SUCCESS = 'Staff added and verification email sent successfully.';
  const ADD_STAFF_AND_BUT_EMAIL_SEND_FAIL = 'Staff added, but failed to send verification email.';
  try {
    const result = await addOrUpdateStaff(payload);
    if (!result.status) {
      throw new ApiError(500, result.message);
    }
    if (!payload.hasSystemAccess) {
      return { message: ADD_STAFF_SUCCESS };
    }
    try {
      await sendAccountVerificationEmail({
        userId: result.userId,
        userEmail: payload.email
      });
      return { message: ADD_STAFF_AND_EMAIL_SEND_SUCCESS };
    } catch (error) {
      return { message: ADD_STAFF_AND_BUT_EMAIL_SEND_FAIL };
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'Unable to add staff');
  }
};

export const processUpdateStaff = async (payload) => {
  const result = await addOrUpdateStaff(payload);
  if (!result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};
