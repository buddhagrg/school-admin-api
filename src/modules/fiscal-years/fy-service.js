import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  addFiscalYear,
  updateFiscalYear,
  getAllFiscalYears,
  activateFiscalYear
} from './fy-repository.js';

export const processAddFiscalYear = async (payload) => {
  const affectedRow = await addFiscalYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add fiscal year');
  }
  return { message: 'Fiscal year added successfully' };
};

export const processUpdateFiscalYear = async (payload) => {
  const affectedRow = await updateFiscalYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update fiscal year');
  }
  return { message: 'Fiscal year updated successfully' };
};

export const processGetAllFiscalYears = async (schoolId) => {
  const fiscalYears = await getAllFiscalYears(schoolId);
  if (fiscalYears.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { fiscalYears };
};

export const processActivateFiscalYear = async (payload) => {
  const affectedRow = await activateFiscalYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to activate fiscal year');
  }
  return { message: 'Fiscal year activated successfully' };
};
