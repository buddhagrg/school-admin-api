import { assertRowCount, handleArryResponse, handleObjectResponse } from '../../utils/index.js';
import {
  getAllSchools,
  getSchool,
  updateSchool,
  deleteSchool,
  getMySchool,
  updateMySchool
} from './school-repository.js';
import { SCHOOL_MESSAGES } from './school-messages.js';

export const processGetAllSchools = async () => {
  return handleArryResponse(() => getAllSchools(), 'schools');
};

export const processGetSchool = async (schoolId) => {
  return handleObjectResponse(() => getSchool(schoolId));
};

export const processGetMySchool = async (schoolId) => {
  return handleObjectResponse(() => getMySchool(schoolId));
};

export const processUpdateSchool = async (payload) => {
  await assertRowCount(updateSchool(payload), SCHOOL_MESSAGES.UPDATE_SCHOOL_FAIL);
  return { message: SCHOOL_MESSAGES.UPDATE_SCHOOL_SUCCESS };
};

export const processDeleteSchool = async (schoolId) => {
  await assertRowCount(deleteSchool(schoolId), SCHOOL_MESSAGES.DELETE_SCHOOL_FAIL);
  return { message: SCHOOL_MESSAGES.DELETE_SCHOOL_SUCCESS };
};

export const processUpdateMySchool = async (payload) => {
  await assertRowCount(updateMySchool(payload), SCHOOL_MESSAGES.UPDATE_MY_SCHOOL_FAIL);
  return { message: SCHOOL_MESSAGES.UPDATE_MY_SCHOOL_SUCCESS };
};
