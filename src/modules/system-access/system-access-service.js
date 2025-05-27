import { env } from '../../config/env.js';
import { ERROR_MESSAGES, VERIFICATION_TOKEN_PURPOSE } from '../../constants/index.js';
import { deleteVerificationToken, saveVerificationToken } from '../../shared/repository/index.js';
import {
  sendPasswordSetupEmail,
  ApiError,
  generateTokenAndHash,
  assertRowCount,
  withTransaction,
  getDateFromMilliseconds,
  generateSHA256Hash
} from '../../utils/index.js';
import {
  getRequestDetail,
  updateRequestStatus,
  requestSystemAccess
} from './system-access-repository.js';
import { sendSystemAccessVerificationEmail } from './util/send-system-access-verification-email.js';
import { SYSTEM_ACCESS_MESSAGES } from './util/system-access-messages.js';

export const processRequestSystemAccess = async (payload) => {
  return withTransaction(async (client) => {
    const systemAccessRequestId = await requestSystemAccess(payload, client);
    if (!systemAccessRequestId) {
      throw new ApiError(500, SYSTEM_ACCESS_MESSAGES.REQUEST_FAIL);
    }

    const { raw: resetKey, hash } = generateTokenAndHash();
    const purpose = VERIFICATION_TOKEN_PURPOSE.SYSTEM_ACCESS_EMAIL_VERIFICATION;
    const identifier = systemAccessRequestId;

    await sendSystemAccessVerificationEmail({
      tokenPayload: { identifier, purpose, resetKey },
      email: payload.email
    });

    const expiryAt = getDateFromMilliseconds(env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS);
    await assertRowCount(
      saveVerificationToken({ identifier, purpose, hash, expiryAt }, client),
      ERROR_MESSAGES.VERIFICATION_TOKEN_NOT_SAVED
    );

    const body = {
      systemAccessRequestId,
      status: SYSTEM_ACCESS_MESSAGES.EMAIL_VERIFICATION_SENT
    };

    await assertRowCount(
      updateRequestStatus(body, client),
      SYSTEM_ACCESS_MESSAGES.VERIFICATION_SENT_BUT_STATUS_UPDATE_FAIL
    );

    return { message: SYSTEM_ACCESS_MESSAGES.REQUEST_SUCCESS };
  }, SYSTEM_ACCESS_MESSAGES.REQUEST_FAIL);
};

export const processVerifySystemAccess = async ({ identifier, purpose, resetKey }) => {
  return withTransaction(async (client) => {
    const hashKey = generateSHA256Hash(resetKey);
    await assertRowCount(
      deleteVerificationToken({ identifier, purpose, hashKey }, client),
      ERROR_MESSAGES.LINK_EXPIRED
    );

    const { email } = await getRequestDetail(identifier, client);
    if (!email) {
      throw new ApiError(404, SYSTEM_ACCESS_MESSAGES.EMAIL_NOT_FOUND);
    }

    await assertRowCount(
      updateRequestStatus(
        {
          systemAccessRequestId: identifier,
          status: SYSTEM_ACCESS_MESSAGES.PASSWORD_SETUP_LINK_SENT
        },
        client
      ),
      SYSTEM_ACCESS_MESSAGES.PWD_SETUP_SENT_BUT_STATUS_UPDATE_FAIL
    );

    const { raw, hash } = generateTokenAndHash();
    const newPurpose = VERIFICATION_TOKEN_PURPOSE.SYSTEM_ACCESS_PWD_SETUP;

    await sendPasswordSetupEmail({
      tokenPayload: { identifier, resetKey: raw, purpose: newPurpose },
      email
    });

    const expiryAt = getDateFromMilliseconds(env.PASSWORD_MANAGE_TOKEN_TIME_IN_MS);
    await assertRowCount(
      saveVerificationToken({ identifier, purpose: newPurpose, hash, expiryAt }, client),
      ERROR_MESSAGES.VERIFICATION_TOKEN_NOT_SAVED
    );

    return { message: SYSTEM_ACCESS_MESSAGES.VERIFY_SUCCESS };
  }, SYSTEM_ACCESS_MESSAGES.VERIFY_FAIL);
};
