import { v4 as uuidV4 } from 'uuid';
import {
  ApiError,
  generateToken,
  generateCsrfHmacHash,
  verifyToken,
  sendPasswordSetupEmail,
  verifyPassword,
  generateHashedPassword,
  sendAccountVerificationEmail,
  formatMyPermission,
  sendMail,
  getSchoolId
} from '../../utils/index.js';
import {
  findUserByEmail,
  invalidateRefreshToken,
  findUserByRefreshToken,
  getMenusByRoleId,
  saveUserLastLoginDetail,
  deleteOldRefreshTokenByUserId,
  verifyAccountEmail,
  doesEmailExist,
  setupUserPassword,
  setupSchoolProfile,
  addAdminStaff,
  addStaticSchoolRoles,
  updateSchoolUserId
} from './auth-repository.js';
import { env, db } from '../../config/index.js';
import { schoolProfileCreatedTemplate } from '../../templates/index.js';
import {
  checkIfSchoolExists,
  findUserById,
  insertRefreshToken
} from '../../shared/repository/index.js';
import { DB_TXN } from '../../constants/index.js';

const PWD_SETUP_EMAIL_SEND_SUCCESS = 'Password setup link emailed successfully.';
const USER_DOES_NOT_EXIST = 'User does not exist';
const USER_HAVE_NO_SYSTEM_ACCESS = 'User do not have access to the system.';
const EMAIL_NOT_VERIFIED = 'Email not verified yet. Please verify your email first.';
const UNABLE_TO_VERIFY_EMAIL = 'Unable to verify email';

export const login = async (email, passwordFromUser, recentDeviceInfo) => {
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const user = await findUserByEmail({ email, client });
    if (!user) {
      throw new ApiError(400, 'Invalid credential');
    }
    const {
      userId,
      roleId,
      name,
      passwordFromDB,
      hasSystemAccess,
      schoolId,
      roleName,
      staticRole,
      isSchoolActive
    } = user;
    if (!isSchoolActive) {
      throw new ApiError(403, 'Your school account is disabled.');
    }
    if (!hasSystemAccess) {
      throw new ApiError(403, 'You do not have access to the system');
    }
    await verifyPassword(passwordFromDB, passwordFromUser);
    const csrfToken = uuidV4();
    const csrfHmacHash = generateCsrfHmacHash(csrfToken);
    const accessToken = generateToken(
      {
        id: userId,
        role: roleName,
        roleId: roleId,
        csrf_hmac: csrfHmacHash,
        schoolId,
        staticRole
      },
      env.JWT_ACCESS_TOKEN_SECRET,
      env.JWT_ACCESS_TOKEN_TIME_IN_MS
    );
    const refreshToken = generateToken(
      { id: userId, role: roleName, roleId: roleId, staticRole },
      env.JWT_REFRESH_TOKEN_SECRET,
      env.JWT_REFRESH_TOKEN_TIME_IN_MS
    );
    await deleteOldRefreshTokenByUserId({ userId, client });
    await insertRefreshToken({ userId, refreshToken, schoolId, client });
    await saveUserLastLoginDetail({
      userId,
      client,
      schoolId,
      recentDeviceInfo
    });
    const permissions = await getMenusByRoleId({
      staticRole,
      roleId,
      schoolId,
      client
    });
    const { hierarchialMenus, apis, uis } = formatMyPermission(permissions);
    await client.query(DB_TXN.COMMIT);
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
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    throw error;
  } finally {
    client.release();
  }
};

export const logout = async (refreshToken) => {
  const affectedRow = await invalidateRefreshToken(refreshToken);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to logout');
  }
  return { message: 'Logged out successfully' };
};

export const getNewAccessAndCsrfToken = async (refreshToken) => {
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const decodedToken = verifyToken(refreshToken, env.JWT_REFRESH_TOKEN_SECRET);
    if (!decodedToken || !decodedToken.id) {
      throw new ApiError(401, 'Invalid refresh token');
    }
    const user = await findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new ApiError(401, 'Token does not exist');
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
      throw new ApiError(401, USER_HAVE_NO_SYSTEM_ACCESS);
    }
    const csrfToken = uuidV4();
    const csrfHmacHash = generateCsrfHmacHash(csrfToken);
    const accessToken = generateToken(
      {
        id: userId,
        role: roleName,
        roleId,
        csrf_hmac: csrfHmacHash,
        schoolId,
        staticRole
      },
      env.JWT_ACCESS_TOKEN_SECRET,
      env.JWT_ACCESS_TOKEN_TIME_IN_MS
    );
    await client.query(DB_TXN.COMMIT);
    return {
      accessToken,
      csrfToken,
      message: 'Refresh-token and csrf-token generated successfully'
    };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    throw error;
  } finally {
    client.release();
  }
};

export const processAccountEmailVerify = async (userId) => {
  const EMAIL_VERIFIED_AND_EMAIL_SEND_SUCCESS =
    'Email verified successfully. Please setup password using link provided in the email.';
  const EMAIL_VERIFIED_BUT_EMAIL_SEND_FAIL =
    'Email verified successfully but fail to send password setup email.';
  try {
    const { has_system_access, is_email_verified } = await findUserById(userId);
    if (!has_system_access) {
      throw new ApiError(400, USER_HAVE_NO_SYSTEM_ACCESS);
    }
    if (is_email_verified) {
      throw new ApiError(400, 'Email already verified');
    }
    const user = await verifyAccountEmail(userId);
    if (!user) {
      throw new ApiError(500, UNABLE_TO_VERIFY_EMAIL);
    }
    try {
      await sendPasswordSetupEmail({ userId, userEmail: user.email });
      return { message: EMAIL_VERIFIED_AND_EMAIL_SEND_SUCCESS };
    } catch (error) {
      return { message: EMAIL_VERIFIED_BUT_EMAIL_SEND_FAIL };
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, UNABLE_TO_VERIFY_EMAIL);
    }
  }
};

export const processPasswordSetup = async (payload) => {
  const { userId, email, password } = payload;
  const emailCount = await doesEmailExist({ userId, email });
  if (emailCount <= 0) {
    throw new ApiError(404, 'Bad request');
  }
  const hashedPassword = await generateHashedPassword(password);
  const affectedRow = await setupUserPassword({
    userId,
    email,
    password: hashedPassword
  });
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to setup password');
  }
  return {
    message: 'Password setup successful. Please login now using your email and password.'
  };
};

export const processResendEmailVerification = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, USER_DOES_NOT_EXIST);
    }
    const { email, is_email_verified, has_system_access } = user;
    if (!has_system_access) {
      throw new ApiError(400, USER_HAVE_NO_SYSTEM_ACCESS);
    }
    if (is_email_verified) {
      throw new ApiError(
        400,
        'Email already verified. Please setup your account password using the link sent in the email.'
      );
    }
    await sendAccountVerificationEmail({ userId, userEmail: email });
    return {
      message:
        'Verification email sent successfully. Please setup password using link provided in the email.'
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, 'Unable to send verification email');
    }
  }
};

export const processResendPwdSetupLink = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, USER_DOES_NOT_EXIST);
    }
    const { email, has_system_access, is_email_verified } = user;
    if (!has_system_access) {
      throw new ApiError(400, USER_HAVE_NO_SYSTEM_ACCESS);
    }
    if (!is_email_verified) {
      throw new ApiError(400, EMAIL_NOT_VERIFIED);
    }
    await sendPasswordSetupEmail({ userId, userEmail: email });
    return { message: PWD_SETUP_EMAIL_SEND_SUCCESS };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, 'Unable to send password setup email');
    }
  }
};

export const processPwdReset = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, USER_DOES_NOT_EXIST);
    }
    const { email, is_email_verified, has_system_access } = user;
    if (!has_system_access) {
      throw new ApiError(400, USER_HAVE_NO_SYSTEM_ACCESS);
    }
    if (!is_email_verified) {
      throw new ApiError(400, EMAIL_NOT_VERIFIED);
    }
    await sendPasswordSetupEmail({ userId, userEmail: email });
    return { message: PWD_SETUP_EMAIL_SEND_SUCCESS };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, 'Unable to reset password');
    }
  }
};

export const sendSchoolRegistrationEmail = async ({ schoolId, schoolName, email }) => {
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: 'School Profile Created',
    html: schoolProfileCreatedTemplate(schoolId, schoolName)
  };
  await sendMail(mailOptions);
};

export const processSetupSchoolProfile = async (payload) => {
  const SCHOOL_PROFILE_CREATE_FAIL = 'Unable to create school profile';
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const schoolId = await getSchoolId(client);
    const updatedPayload = {
      ...payload,
      schoolId
    };
    const result = await setupSchoolProfile({
      payload: updatedPayload,
      client
    });
    if (!result) {
      throw new ApiError(500, SCHOOL_PROFILE_CREATE_FAIL);
    }
    await sendSchoolRegistrationEmail({
      schoolId,
      schoolName: payload.name,
      email: payload.email
    });
    await client.query(DB_TXN.COMMIT);
    return {
      schoolId,
      message: 'School profile created successfully'
    };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, SCHOOL_PROFILE_CREATE_FAIL);
    }
  } finally {
    client.release();
  }
};

export const processSetupAdminProfile = async (payload) => {
  const ADMIN_PROFILE_ADD_FAIL = 'Unable to add admin profile';
  const SCHOOL_NOT_FOUND = 'School does not exist';
  const ADMIN_PROFILE_ADD_AND_VERIFICATION_EMAIL_SENT_SUCCESS =
    'Admin profile created. Please check your email to verify your account.';
  const ADMIN_PROFILE_ADD_SUCCESS_BUT_VERIFICATION_EMAIL_SENT_FAIL =
    'Admin profile created but fail to send account verification email.';
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const school = await checkIfSchoolExists({
      schoolId: payload.schoolId,
      client
    });
    if (!school) {
      throw new ApiError(404, SCHOOL_NOT_FOUND);
    }
    const roles = await addStaticSchoolRoles({
      schoolId: payload.schoolId,
      client
    });
    if (roles.length <= 0) {
      throw new ApiError(500, 'Unable to add roles for the school');
    }
    const adminRoleId = roles.find((role) => role.static_role === 'ADMIN')?.id || null;
    const updatedPayload = {
      ...payload,
      role: adminRoleId
    };
    const result = await addAdminStaff({ payload: updatedPayload, client });
    if (!result.status) {
      throw new ApiError(500, result.message);
    }
    try {
      await sendAccountVerificationEmail({
        userId: result.userId,
        userEmail: school.email
      });
      await updateSchoolUserId({
        lastModifieddBy: result.userId,
        schoolId: payload.schoolId,
        client
      });
      await client.query(DB_TXN.COMMIT);
      return { message: ADMIN_PROFILE_ADD_AND_VERIFICATION_EMAIL_SENT_SUCCESS };
    } catch (error) {
      throw new ApiError(500, ADMIN_PROFILE_ADD_SUCCESS_BUT_VERIFICATION_EMAIL_SENT_FAIL);
    }
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, ADMIN_PROFILE_ADD_FAIL);
    }
  } finally {
    client.release();
  }
};
