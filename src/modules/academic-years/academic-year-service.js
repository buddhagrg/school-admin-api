import { assertRowCount, handleArryResponse, withTransaction } from '../../utils/index.js';
import { ACADEMIC_YEAR_MESSAGES } from './academic-year-messages.js';
import {
  getAllAcademicYears,
  addAcademicYear,
  updateAcademicYear,
  deactivateOtherAcademicYearStatus
} from './academic-year-repository.js';

export const processGetAllAcademicYears = async (schoolId) => {
  return handleArryResponse(() => getAllAcademicYears(schoolId), 'academicYears');
};

export const processAddAcademicYear = async (payload) => {
  return withTransaction(async (client) => {
    const { isActive, schoolId } = payload;
    if ([true, 'true'].includes(isActive)) {
      deactivateOtherAcademicYearStatus(schoolId, client),
        ACADEMIC_YEAR_MESSAGES.ADD_ACADEMIC_YEAR_FAIL;
    }

    await assertRowCount(
      addAcademicYear(payload, client),
      ACADEMIC_YEAR_MESSAGES.ADD_ACADEMIC_YEAR_FAIL
    );

    return { message: ACADEMIC_YEAR_MESSAGES.ADD_ACADEMIC_YEAR_SUCCESS };
  }, ACADEMIC_YEAR_MESSAGES.ADD_ACADEMIC_YEAR_FAIL);
};

export const processUpdateAcademicYear = async (payload) => {
  return withTransaction(async (client) => {
    const { isActive, schoolId } = payload;
    if ([true, 'true'].includes(isActive)) {
      await assertRowCount(
        deactivateOtherAcademicYearStatus(schoolId, client),
        ACADEMIC_YEAR_MESSAGES.UPDATE_ACADEMIC_YEAR_FAIL
      );
    }

    await assertRowCount(
      updateAcademicYear(payload, client),
      ACADEMIC_YEAR_MESSAGES.UPDATE_ACADEMIC_YEAR_FAIL
    );
    return { message: ACADEMIC_YEAR_MESSAGES.UPDATE_ACADEMIC_YEAR_SUCCESS };
  }, ACADEMIC_YEAR_MESSAGES.UPDATE_ACADEMIC_YEAR_FAIL);
};
