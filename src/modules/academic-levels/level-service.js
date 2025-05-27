import {
  ApiError,
  assertFunctionResult,
  assertRowCount,
  handleArryResponse,
  withTransaction
} from '../../utils/index.js';
import {
  getAllLevels,
  updateLevel,
  addLevel,
  deleteLevel,
  getPeriodsOfLevel,
  addPeriod,
  updatePeriod,
  deletePeriod,
  updatePeriodOrderToNegative,
  updatePeriodOrder
} from './level-repository.js';
import { LEVEL_MESSAGES, PERIOD_MESSAGES } from './level-messages.js';

export const processAddLevel = async (payload) => {
  await assertRowCount(addLevel(payload), LEVEL_MESSAGES.ADD_LEVEL_FAIL);
  return { message: LEVEL_MESSAGES.ADD_LEVEL_SUCCESS };
};

export const processUpdateLevel = async (payload) => {
  await assertRowCount(updateLevel(payload), LEVEL_MESSAGES.UPDATE_LEVEL_FAIL);
  return { message: LEVEL_MESSAGES.UPDATE_LEVEL_SUCCESS };
};

export const processGetLevels = async (schoolId) => {
  return handleArryResponse(() => getAllLevels(schoolId), 'academicLevels');
};

export const processDeleteLevel = async (payload) => {
  await assertRowCount(deleteLevel(payload), LEVEL_MESSAGES.DELETE_LEVEL_FAIL);
  return { message: LEVEL_MESSAGES.DELETE_LEVEL_SUCCESS };
};

export const processReorderPeriods = async (payload) => {
  const { periods } = payload;

  if (!Array.isArray(periods) || periods.length <= 0) {
    throw new ApiError(400, PERIOD_MESSAGES.PERIODS_CANNOT_BE_EMPTY);
  }

  return withTransaction(async (client) => {
    await assertRowCount(
      updatePeriodOrderToNegative(payload, client),
      PERIOD_MESSAGES.PERIOD_REORDER_FAIL
    );
    await assertRowCount(
      updatePeriodOrder(payload.schoolId, client),
      PERIOD_MESSAGES.PERIOD_REORDER_FAIL
    );

    return { message: PERIOD_MESSAGES.PERIOD_REORDER_SUCCESS };
  }, PERIOD_MESSAGES.PERIOD_REORDER_FAIL);
};

export const processGetPeriodsOfLevel = async (payload) => {
  return handleArryResponse(
    () => getPeriodsOfLevel(payload),
    'academicPeriods',
    (data) => data.sort((a, b) => a.sortOrder - b.sortOrder).map(({ sortOrder, ...item }) => item)
  );
};

export const processAddPeriod = async (payload) => {
  await assertRowCount(addPeriod(payload), PERIOD_MESSAGES.ADD_PERIOD_FAIL);
  return { message: PERIOD_MESSAGES.ADD_PERIOD_SUCCESS };
};

export const processUpdatePeriod = async (payload) => {
  await assertRowCount(updatePeriod(payload), PERIOD_MESSAGES.UPDATE_PERIOD_FAIL);
  return { message: PERIOD_MESSAGES.UPDATE_PERIOD_SUCCESS };
};

export const processDeletePeriod = async (payload) => {
  const result = await assertFunctionResult(deletePeriod(payload));
  return { message: result.message };
};
