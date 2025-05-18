import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  getAllAcademicYears,
  addAcademicYear,
  updateAcademicYear
} from './academic-year-repository.js';

export const processGetAllAcademicYears = async (schoolId) => {
  const academicYears = await getAllAcademicYears(schoolId);
  if (academicYears.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { academicYears };
};

export const processAddAcademicYear = async (payload) => {
  const affectedRow = await addAcademicYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add academic year');
  }
  return { message: 'Academic year added successfully' };
};

export const processUpdateAcademicYear = async (payload) => {
  const affectedRow = await updateAcademicYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update academic year');
  }
  return { message: 'Academic year updated successfully' };
};
