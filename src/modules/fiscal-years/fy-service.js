import { assertRowCount, handleArryResponse } from '../../utils/index.js';
import {
  addFiscalYear,
  updateFiscalYear,
  getAllFiscalYears,
  activateFiscalYear
} from './fy-repository.js';
import { FISCAL_YEAR_MESSAGES } from './fy-messages.js';

export const processAddFiscalYear = async (payload) => {
  await assertRowCount(addFiscalYear(payload), FISCAL_YEAR_MESSAGES.ADD_FY_FAIL);
  return { message: FISCAL_YEAR_MESSAGES.ADD_FY_SUCCESS };
};

export const processUpdateFiscalYear = async (payload) => {
  await assertRowCount(updateFiscalYear(payload), FISCAL_YEAR_MESSAGES.UPDATE_FY_FAIL);
  return { message: FISCAL_YEAR_MESSAGES.UPDATE_FY_SUCCESS };
};

export const processActivateFiscalYear = async (payload) => {
  await assertRowCount(activateFiscalYear(payload), FISCAL_YEAR_MESSAGES.ACTIVATE_FY_FAIL);
  return { message: FISCAL_YEAR_MESSAGES.ACTIVATE_FY_SUCCESS };
};

export const processGetAllFiscalYears = async (schoolId) => {
  return handleArryResponse(() => getAllFiscalYears(schoolId), 'fiscalYears');
};
