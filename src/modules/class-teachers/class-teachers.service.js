import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  getAllClassTeachers,
  assignClassTeacher,
  updateClassTeacher
} from './class-teachers.repository.js';

export const processGetAllClassTeachers = async (schoolId) => {
  const classTeachers = await getAllClassTeachers(schoolId);
  if (!Array.isArray(classTeachers) || classTeachers.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { classTeachers };
};

export const processAssignClassTeacher = async (payload) => {
  const affectedRow = await assignClassTeacher(payload);
  if (affectedRow <= 0) {
    throw new ApiError(404, 'Unable to assign class teacher');
  }
  return { message: 'Class Teacher assigned successfully' };
};

export const processUpdateClassTeacher = async (payload) => {
  const affectedRow = await updateClassTeacher(payload);
  if (affectedRow <= 0) {
    throw new ApiError(404, 'Unable to update class teacher');
  }
  return { message: 'Class Teacher updated successfully' };
};
