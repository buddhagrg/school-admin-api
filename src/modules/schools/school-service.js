import { db } from '../../config/index.js';
import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  getAllSchools,
  getSchool,
  updateSchool,
  deleteSchool,
  getMySchool,
  updateMySchool
} from './school-repository.js';

export const processGetAllSchools = async () => {
  const schools = await getAllSchools();
  if (schools.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { schools };
};

export const processGetSchool = async (schoolId) => {
  const school = await getSchool(schoolId);
  if (!school) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return school;
};

export const processUpdateSchool = async (payload) => {
  const affectedRow = await updateSchool(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update school');
  }
  return { message: 'School update successfully' };
};

export const processDeleteSchool = async (schoolId) => {
  const affectedRow = await deleteSchool(schoolId);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to delete school');
  }
  return { message: 'School delete successfully' };
};

export const processGetMySchool = async (payload) => {
  const school = await getMySchool(payload);
  if (!school) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return school;
};

export const processUpdateMySchool = async (payload) => {
  const affectedRow = await updateMySchool(payload);
  if (!affectedRow || affectedRow <= 0) {
    throw new ApiError(404, 'Unable to update school detail');
  }
  return { message: 'School detail updated successfully' };
};
