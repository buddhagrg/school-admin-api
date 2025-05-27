import { ERROR_MESSAGES, VERIFICATION_TOKEN_PURPOSE } from '../../constants/index.js';
import { saveVerificationToken } from '../../shared/repository/save-verification-token.js';
import {
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
  addOrUpdateStaff,
  getStaffDetailForView,
  getAllStaff,
  getStaffDetailForEdit
} from './staff-repository.js';
import { STAFF_MESSAGES } from './staff-messages.js';
import { env } from '../../config/env.js';

export const processAddStaff = async (payload) => {
  return withTransaction(async (client) => {
    const result = await assertFunctionResult(addOrUpdateStaff(payload, client));
    if (!payload.hasSystemAccess) {
      return { message: STAFF_MESSAGES.ADD_STAFF_SUCCESS };
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

      return { message: STAFF_MESSAGES.ADD_STAFF_AND_EMAIL_SEND_SUCCESS };
    } catch (error) {
      return { message: STAFF_MESSAGES.ADD_STAFF_AND_BUT_EMAIL_SEND_FAIL };
    }
  }, STAFF_MESSAGES.ADD_STAFF_FAIL);
};

export const processGetAllStaff = async (schoolId) => {
  return handleArryResponse(() => getAllStaff(schoolId), 'staff');
};

export const processGetStaffDetail = async (payload) => {
  const { mode } = payload;
  if (mode === 'edit') {
    return handleObjectResponse(() => getStaffDetailForEdit(payload));
  }

  return handleObjectResponse(() => getStaffDetailForView(payload));
};

export const processUpdateStaff = async (payload) => {
  const result = await assertFunctionResult(addOrUpdateStaff(payload));
  return { message: result.message };
};
