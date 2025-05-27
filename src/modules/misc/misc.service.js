import { assertRowCount, handleArryResponse, handleObjectResponse } from '../../utils/index.js';
import { contactUs, getDashboardData, getAllTeachersOfSchool } from './misc.repository.js';
import { MISC_MESSAGES } from './misc-messages.js';

export const processContactUs = async (payload) => {
  await assertRowCount(contactUs(payload), MISC_MESSAGES.CONTACT_FAIL);
  return { message: MISC_MESSAGES.CONTACT_SUCCESS };
};

export const processGetDashboardData = async (payload) => {
  return handleObjectResponse(() => getDashboardData(payload));
};

export const processGetAllTeachersOfSchool = async (schoolId) => {
  return handleArryResponse(() => getAllTeachersOfSchool(schoolId), 'teachers');
};
