import { assertRowCount, handleArryResponse } from '../../utils/index.js';
import {
  getAllClassTeachers,
  assignClassTeacher,
  updateClassTeacher
} from './class-teachers.repository.js';
import { CLASS_TEACHER_MESSAGES } from './class-teacher-messages.js';

export const processAssignClassTeacher = async (payload) => {
  await assertRowCount(assignClassTeacher(payload), CLASS_TEACHER_MESSAGES.ASSIGN_FAIL);
  return { message: CLASS_TEACHER_MESSAGES.ASSIGN_SUCCESS };
};

export const processUpdateClassTeacher = async (payload) => {
  await assertRowCount(updateClassTeacher(payload), CLASS_TEACHER_MESSAGES.UPDATE_FAIL);
  return { message: CLASS_TEACHER_MESSAGES.UPDATE_SUCCESS };
};

export const processGetAllClassTeachers = async (schoolId) => {
  return handleArryResponse(() => getAllClassTeachers(schoolId), 'classTeachers');
};
