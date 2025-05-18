import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import { contactUs, getDashboardData, getAllTeachersOfSchool } from './misc.repository.js';

export const processContactUs = async (payload) => {
  const affectedRow = await contactUs(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Message couldn't be sent. Please try again later.");
  }
  return { message: 'Your message has been sent successfully.' };
};

export const processGetDashboardData = async (payload) => {
  const data = await getDashboardData(payload);
  if (!data) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return data;
};

export const processGetAllTeachersOfSchool = async (schoolId) => {
  const teachers = await getAllTeachersOfSchool(schoolId);
  if (!Array.isArray(teachers) || teachers.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { teachers };
};
