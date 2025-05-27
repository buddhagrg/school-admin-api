import { assertFunctionResult, assertRowCount, handleArryResponse } from '../../utils/index.js';
import {
  getAllExamNames,
  addExamName,
  updateExamName,
  deleteExamName,
  addExamDetail,
  getExamRoutine,
  addMarks,
  getExamMarksheet,
  getExamDetail,
  updateExamDetail,
  updateMarks,
  getMarks
} from './exam-repository.js';
import { EXAM_MESSAGES } from './exam-messages.js';

export const processAddExamName = async (payload) => {
  await assertRowCount(addExamName(payload), EXAM_MESSAGES.ADD_EXAM_NAME_FAIL);
  return { message: EXAM_MESSAGES.ADD_EXAM_NAME_SUCCESS };
};

export const processUpdateExamName = async (payload) => {
  await assertRowCount(updateExamName(payload), EXAM_MESSAGES.UPDATE_EXAM_NAME_FAIL);
  return { message: EXAM_MESSAGES.UPDATE_EXAM_NAME_SUCCESS };
};

export const processDeleteExamName = async (payload) => {
  await assertRowCount(deleteExamName(payload), EXAM_MESSAGES.DELETE_EXAM_NAME_FAIL);
  return { message: EXAM_MESSAGES.DELETE_EXAM_NAME_SUCCESS };
};

export const processGetAllExamNames = async (schoolId) => {
  return handleArryResponse(() => getAllExamNames(schoolId), 'exams');
};

export const processAddExamDetail = async (payload) => {
  const result = await assertFunctionResult(addExamDetail(payload));
  return { message: result.message };
};

export const processUpdateExamDetail = async (payload) => {
  const result = await assertFunctionResult(updateExamDetail(payload));
  return { message: result.message };
};

export const processGetExamRoutine = async (payload) => {
  return handleArryResponse(() => getExamRoutine(payload), 'routines');
};

export const processGetMarks = async (payload) => {
  return handleArryResponse(() => getMarks(payload), 'marks');
};

export const processAddMarks = async (payload) => {
  const result = await assertFunctionResult(addMarks(payload));
  return { message: result.message };
};

export const processUpdateMarks = async (payload) => {
  const result = await assertFunctionResult(updateMarks(payload));
  return { message: result.message };
};

export const processGetExamMarksheet = async (payload) => {
  return handleArryResponse(() => getExamMarksheet(payload), 'marksheets');
};

export const processGetExamDetail = async (payload) => {
  return handleArryResponse(() => getExamDetail(payload), 'examDetails');
};
