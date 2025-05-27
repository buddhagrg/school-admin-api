import { ERROR_MESSAGES, VERIFICATION_TOKEN_PURPOSE } from '../../constants/index.js';
import { saveVerificationToken } from '../../shared/repository/save-verification-token.js';
import {
  ApiError,
  assertFunctionResult,
  assertRowCount,
  generateTokenAndHash,
  getDateFromMilliseconds,
  handleArryResponse,
  handleObjectResponse,
  sendAccountVerificationEmail,
  withTransaction
} from '../../utils/index.js';
import {
  addOrUpdateStudent,
  getStudentDueFees,
  getStudents,
  getStudentDetailForEdit,
  getStudentDetailForView
} from './student-repository.js';
import { STUDENT_MESSAGES } from './student-messages.js';
import { env } from '../../config/env.js';
import { updateUserSystemAccessStatus } from '../../shared/repository/index.js';

export const addNewStudent = async (payload) => {
  return withTransaction(async (client) => {
    const result = await assertFunctionResult(addOrUpdateStudent(payload, client));

    if (!payload.hasSystemAccess) {
      return { message: STUDENT_MESSAGES.ADD_STUDENT_SUCCESS };
    }

    try {
      const identifier = result.userId;
      const purpose = VERIFICATION_TOKEN_PURPOSE.USER_EMAIL_VERIFICATION;
      const { raw: resetKey, hash } = generateTokenAndHash();

      await sendAccountVerificationEmail({
        tokenPayload: { identifier, purpose, resetKey },
        email: payload.email
      });

      const expiryAt = getDateFromMilliseconds(env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS);
      await assertRowCount(
        saveVerificationToken({ identifier, purpose, hash, expiryAt }, client),
        ERROR_MESSAGES.VERIFICATION_TOKEN_NOT_SAVED
      );

      return { message: STUDENT_MESSAGES.ADD_STUDENT_AND_EMAIL_SEND_SUCCESS };
    } catch (error) {
      throw new ApiError(500, STUDENT_MESSAGES.ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL);
    }
  }, STUDENT_MESSAGES.ADD_STUDENT_FAIL);
};

export const processGetStudents = async (payload) => {
  return handleArryResponse(() => getStudents(payload), 'students');
};

export const processGetStudentDetail = async (payload) => {
  const { mode } = payload;
  if (mode === 'edit') {
    return handleObjectResponse(() => getStudentDetailForEdit(payload));
  }
  return handleObjectResponse(() => getStudentDetailForView(payload));
};

export const updateStudent = async (payload) => {
  const result = await assertFunctionResult(addOrUpdateStudent(payload));
  return { message: result.message };
};

export const processGetStudentDueFees = async (payload) => {
  return handleArryResponse(() => getStudentDueFees(payload), 'dueFees');
};

export const processUpdateStudentStatus = async (payload) => {
  await assertRowCount(
    updateUserSystemAccessStatus(payload),
    ERROR_MESSAGES.UPDATE_SYSTEM_ACCESS_STATUS_FAIL
  );
  return { message: ERROR_MESSAGES.UPDATE_SYSTEM_ACCESS_STATUS_SUCCESS };
};
