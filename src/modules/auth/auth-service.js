import { v4 as uuidV4 } from 'uuid';
import {
  ApiError,
  generateCsrfHmacHash,
  sendPasswordSetupEmail,
  verifyPassword,
  generateHashedPassword,
  sendAccountVerificationEmail,
  formatMyPermission,
  generateAccesstoken,
  generateRefreshtoken,
  generateTokenAndHash,
  assertRowCount,
  generateSHA256Hash,
  assertFunctionResult,
  withTransaction,
  getDateFromMilliseconds
} from '../../utils/index.js';
import {
  findUserByEmail,
  invalidateRefreshToken,
  findUserByRefreshToken,
  getMenusByRoleId,
  saveUserLastLoginDetail,
  deleteOldRefreshTokenByUserId,
  verifyAccountEmail,
  updatePassword,
  setupPasswordForAccessRequest
} from './auth-repository.js';
import {
  deleteVerificationToken,
  findUserById,
  insertRefreshToken,
  saveVerificationToken
} from '../../shared/repository/index.js';
import { ERROR_MESSAGES, VERIFICATION_TOKEN_PURPOSE } from '../../constants/index.js';
import { sendPasswordResetRequestEmail } from './utils/send-password-reset-request-email.js';
import { AUTH_MESSAGES } from './utils/auth-messages.js';
import { env } from '../../config/env.js';

export const login = async (email, passwordFromUser, recentDeviceInfo) => {
  return withTransaction(async (client) => {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new ApiError(400, AUTH_MESSAGES.INVALID_CREDENTIAL);
    }
    const {
      userId,
      roleId,
      name,
      passwordFromDB,
      hasSystemAccess,
      schoolId,
      roleName,
      staticRole
    } = user;
    if (!hasSystemAccess) {
      throw new ApiError(403, AUTH_MESSAGES.NO_SYSTEM_ACCESS);
    }

    await verifyPassword(passwordFromDB, passwordFromUser);
    await deleteOldRefreshTokenByUserId(userId, client);

    const csrfToken = uuidV4();
    const csrfHmacHash = generateCsrfHmacHash(csrfToken);
    const accessToken = generateAccesstoken({
      userId,
      role: roleName,
      roleId: roleId,
      csrf_hmac: csrfHmacHash,
      schoolId,
      staticRole
    });
    const refreshToken = generateRefreshtoken({
      userId,
      role: roleName,
      roleId: roleId,
      staticRole
    });
    await insertRefreshToken({ userId, refreshToken, schoolId }, client);

    await saveUserLastLoginDetail(
      {
        userId,
        schoolId,
        recentDeviceInfo
      },
      client
    );

    const permissions = await getMenusByRoleId(
      {
        staticRole,
        roleId,
        schoolId
      },
      client
    );
    const { hierarchialMenus, apis, uis } = formatMyPermission(permissions);
    const accountBasic = {
      id: userId,
      roleId: staticRole,
      name,
      email,
      role: roleName,
      menus: hierarchialMenus,
      uis,
      apis,
      appBase: staticRole === 'SYSTEM_ADMIN' ? '/admin' : ''
    };

    return { accessToken, refreshToken, csrfToken, accountBasic };
  }, AUTH_MESSAGES.LOGIN_FAIL);
};

export const logout = async (refreshToken) => {
  await assertRowCount(invalidateRefreshToken(refreshToken), AUTH_MESSAGES.LOGOUT_FAIL);
  return { message: AUTH_MESSAGES.LOGOUT_SUCCESS };
};

export const getNewAccessAndCsrfToken = async (refreshToken) => {
  const user = await findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new ApiError(401, AUTH_MESSAGES.TOKEN_NOT_FOUND);
  }

  const {
    id: userId,
    role_id: roleId,
    has_system_access,
    school_id: schoolId,
    staticRole,
    roleName
  } = user;
  if (!has_system_access) {
    throw new ApiError(401, AUTH_MESSAGES.USER_HAVE_NO_SYSTEM_ACCESS);
  }

  const csrfToken = uuidV4();
  const csrfHmacHash = generateCsrfHmacHash(csrfToken);
  const accessToken = generateAccesstoken({
    userId,
    role: roleName,
    roleId,
    csrf_hmac: csrfHmacHash,
    schoolId,
    staticRole
  });

  return {
    accessToken,
    csrfToken,
    message: AUTH_MESSAGES.TOKEN_REFRESH_SUCCESS
  };
};

export const processAccountEmailVerify = async ({ identifier, purpose, resetKey }) => {
  return withTransaction(async (client) => {
    const { has_system_access } = await findUserById(identifier);
    if (!has_system_access) {
      throw new ApiError(400, AUTH_MESSAGES.USER_HAVE_NO_SYSTEM_ACCESS);
    }

    //check and delete verification token
    const hashKey = generateSHA256Hash(resetKey);
    await assertRowCount(
      deleteVerificationToken({ identifier, purpose, hashKey }, client),
      ERROR_MESSAGES.LINK_EXPIRED
    );

    //set email as verified
    const user = await verifyAccountEmail(identifier, client);
    if (!user) {
      throw new ApiError(500, AUTH_MESSAGES.UNABLE_TO_VERIFY_EMAIL);
    }

    try {
      const { raw, hash } = generateTokenAndHash();
      const newPurpose = VERIFICATION_TOKEN_PURPOSE.USER_PWD_SETUP;
      await sendPasswordSetupEmail({
        tokenPayload: { identifier, purpose: newPurpose, resetKey: raw },
        email: user.email
      });

      //save verification token
      const expiryAt = getDateFromMilliseconds(env.PASSWORD_MANAGE_TOKEN_TIME_IN_MS);
      await assertRowCount(
        saveVerificationToken({ identifier, purpose: newPurpose, hash, expiryAt }, client),
        ERROR_MESSAGES.VERIFICATION_TOKEN_NOT_SAVED
      );

      return { message: AUTH_MESSAGES.EMAIL_VERIFIED_AND_EMAIL_SEND_SUCCESS };
    } catch (error) {
      return { message: AUTH_MESSAGES.EMAIL_VERIFIED_BUT_EMAIL_SEND_FAIL };
    }
  }, AUTH_MESSAGES.UNABLE_TO_VERIFY_EMAIL);
};

export const processResendEmailVerification = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, AUTH_MESSAGES.USER_DOES_NOT_EXIST);
    }
    const { email, has_system_access } = user;
    if (!has_system_access) {
      throw new ApiError(400, AUTH_MESSAGES.USER_HAVE_NO_SYSTEM_ACCESS);
    }

    const identifier = userId;
    const purpose = VERIFICATION_TOKEN_PURPOSE.USER_EMAIL_VERIFICATION_RESEND;
    const { raw: resetKey, hash } = generateTokenAndHash();
    await sendAccountVerificationEmail({ tokenPayload: { identifier, purpose, resetKey }, email });

    //save verification token
    const expiryAt = getDateFromMilliseconds(env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS);
    await assertRowCount(
      saveVerificationToken({ identifier, purpose, hash, expiryAt }),
      ERROR_MESSAGES.VERIFICATION_TOKEN_NOT_SAVED
    );

    return { message: AUTH_MESSAGES.RESEND_EMAIL_SUCCESS };
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError(500, AUTH_MESSAGES.RESEND_EMAIL_FAIL);
  }
};

export const processResendPwdSetupLink = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, AUTH_MESSAGES.USER_DOES_NOT_EXIST);
    }
    const { email, has_system_access } = user;
    if (!has_system_access) {
      throw new ApiError(400, AUTH_MESSAGES.USER_HAVE_NO_SYSTEM_ACCESS);
    }

    const identifier = userId;
    const purpose = VERIFICATION_TOKEN_PURPOSE.USER_PWD_SETUP_RESEND;
    const { raw: resetKey, hash } = generateTokenAndHash();
    await sendPasswordSetupEmail({
      tokenPayload: { identifier, purpose, resetKey },
      email
    });

    //save verification token
    const expiryAt = getDateFromMilliseconds(env.PASSWORD_MANAGE_TOKEN_TIME_IN_MS);
    await assertRowCount(
      saveVerificationToken({ identifier, purpose, hash, expiryAt }),
      ERROR_MESSAGES.VERIFICATION_TOKEN_NOT_SAVED
    );

    return { message: AUTH_MESSAGES.PWD_SETUP_EMAIL_SEND_SUCCESS };
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, AUTH_MESSAGES.RESEND_PWD_SETUP_FAIL);
  }
};

export const processRequestPwdReset = async (email) => {
  if (email === 'admin@school-admin.xyz') {
    throw new ApiError(ERROR_MESSAGES.DISABLED_IN_DEMO_ACCOUNT);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(404, AUTH_MESSAGES.INVALID_EMAIL);
  }

  const identifier = email;
  const purpose = VERIFICATION_TOKEN_PURPOSE.USER_PWD_RESET;
  const { raw: resetKey, hash } = generateTokenAndHash();
  await sendPasswordResetRequestEmail({
    tokenPayload: { identifier, purpose, resetKey },
    email
  });

  //save verification token
  const expiryAt = getDateFromMilliseconds(env.PASSWORD_MANAGE_TOKEN_TIME_IN_MS);
  await assertRowCount(
    saveVerificationToken({ identifier, purpose, hash, expiryAt }),
    ERROR_MESSAGES.VERIFICATION_TOKEN_NOT_SAVED
  );

  return { message: AUTH_MESSAGES.EMAIL_SEND_SUCCESS };
};

export const processPwdReset = async (payload) => {
  const { identifier, purpose, resetKey, password } = payload;
  return withTransaction(async (client) => {
    //check and delete verification token
    const hashKey = generateSHA256Hash(resetKey);
    await assertRowCount(
      deleteVerificationToken({ identifier, purpose, hashKey }, client),
      ERROR_MESSAGES.LINK_EXPIRED
    );

    //update pwd in db
    const hashedPassword = await generateHashedPassword(password);
    await assertRowCount(
      updatePassword({ email: identifier, hashedPassword }, client),
      AUTH_MESSAGES.RESET_PWD_FAIL
    );

    return { message: AUTH_MESSAGES.RESET_PWD_SUCCESS };
  }, AUTH_MESSAGES.RESET_PWD_FAIL);
};

export const processSetupPassword = async (payload) => {
  const { identifier, purpose, resetKey, password } = payload;
  return withTransaction(async (client) => {
    //check and delete verification token
    const hashKey = generateSHA256Hash(resetKey);
    await assertRowCount(
      deleteVerificationToken({ identifier, purpose, hashKey }, client),
      ERROR_MESSAGES.LINK_EXPIRED
    );

    const hashedPassword = await generateHashedPassword(password);
    if (purpose === VERIFICATION_TOKEN_PURPOSE.SYSTEM_ACCESS_PWD_SETUP) {
      return await processAccessRequestPwdSetup(
        { systemAccessRequestId: identifier, hashedPassword },
        client
      );
    }
    return await processAuthPwdSetup({ userId: identifier, hashedPassword }, client);
  }, AUTH_MESSAGES.PWD_SETUP_FAIL);
};

const processAccessRequestPwdSetup = async (payload, client) => {
  const result = await assertFunctionResult(setupPasswordForAccessRequest(payload, client));
  return { message: result.message };
};

const processAuthPwdSetup = async (payload, client) => {
  await assertRowCount(updatePassword(payload, client), AUTH_MESSAGES.PWD_SETUP_FAIL);
  return { message: AUTH_MESSAGES.PWD_SETUP_SUCCESS };
};
