import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import { addSubject, updateSubject, deleteSubject, getAllSubjects } from './subject-repository.js';

export const processAddSubject = async (payload) => {
  const affectedRow = await addSubject(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add subject');
  }
  return { message: 'Subject added successfully' };
};

export const processUpdateSubject = async (payload) => {
  const affectedRow = await updateSubject(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update subject');
  }
  return { message: 'Subject updated successfully' };
};

export const processDeleteSubject = async (payload) => {
  const affectedRow = await deleteSubject(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to delete subject');
  }
  return { message: 'Subject deleted successfully' };
};

export const processGetAllSubjects = async (payload) => {
  const subjects = await getAllSubjects(payload);
  if (subjects.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { subjects };
};
