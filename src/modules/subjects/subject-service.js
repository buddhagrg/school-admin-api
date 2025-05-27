import { assertRowCount, handleArryResponse } from '../../utils/index.js';
import { addSubject, updateSubject, deleteSubject, getAllSubjects } from './subject-repository.js';
import { SUBJECT_MESSAGES } from './subject-messages.js';

export const processAddSubject = async (payload) => {
  await assertRowCount(addSubject(payload), SUBJECT_MESSAGES.ADD_SUBJECT_FAIL);
  return { message: SUBJECT_MESSAGES.ADD_SUBJECT_SUCCESS };
};

export const processUpdateSubject = async (payload) => {
  await assertRowCount(updateSubject(payload), SUBJECT_MESSAGES.UPDATE_SUBJECT_FAIL);
  return { message: SUBJECT_MESSAGES.UPDATE_SUBJECT_SUCCESS };
};

export const processDeleteSubject = async (payload) => {
  await assertRowCount(deleteSubject(payload), SUBJECT_MESSAGES.DELETE_SUBJECT_FAIL);
  return { message: SUBJECT_MESSAGES.DELETE_SUBJECT_SUCCESS };
};

export const processGetAllSubjects = async (payload) => {
  return handleArryResponse(() => getAllSubjects(payload), 'subjects');
};
