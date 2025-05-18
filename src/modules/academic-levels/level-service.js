import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  getAllLevels,
  updateLevel,
  addLevel,
  deleteLevel,
  reorderPeriods,
  getPeriodsOfLevel,
  addPeriod,
  updatePeriod,
  deletePeriod
} from './level-repository.js';

export const processAddLevel = async (payload) => {
  const affectedRow = await addLevel(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unabel to add school level');
  }
  return { message: 'School level added successfully' };
};

export const processUpdateLevel = async (payload) => {
  const affectedRow = await updateLevel(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unabel to updated school level');
  }
  return { message: 'School level updated successfully' };
};
export const processGetLevels = async (schoolId) => {
  const academicLevels = await getAllLevels(schoolId);
  if (academicLevels.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { academicLevels };
};

export const processDeleteLevel = async (payload) => {
  const affectedRow = await deleteLevel(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to delete academic level');
  }
  return { message: 'Academic Level deleted successfully' };
};

export const processReorderPeriods = async (payload) => {
  const { periods } = payload;
  if (!Array.isArray(periods) || periods.length <= 0) {
    throw new ApiError(400, 'Bad request');
  }
  const affectedRow = await reorderPeriods(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to manage period order');
  }
  return { message: 'Period order updated successfully' };
};

export const processGetPeriodsOfLevel = async (payload) => {
  const academicPeriods = await getPeriodsOfLevel(payload);
  if (academicPeriods.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  const res = academicPeriods
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ sortOrder, ...item }) => item);
  return { academicPeriods: res };
};

export const processAddPeriod = async (payload) => {
  const affectedRow = await addPeriod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add academic period');
  }
  return { message: 'Academic Period added successfully' };
};

export const processUpdatePeriod = async (payload) => {
  const affectedRow = await updatePeriod(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update academic period');
  }
  return { message: 'Academic Period updated successfully' };
};

export const processDeletePeriod = async (payload) => {
  const result = await deletePeriod(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};
