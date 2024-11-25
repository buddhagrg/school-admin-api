const {
  ApiError,
  generateToken,
  generateCsrfHmacHash,
  verifyToken,
  sendPasswordSetupEmail,
  verifyPassword,
  generateHashedPassword,
  sendAccountVerificationEmail,
  formatMyPermission,
  generateSixDigitRandomNumber,
  sendMail,
  getSchoolId,
} = require("../../utils");
const {
  findUserByUsername,
  invalidateRefreshToken,
  findUserByRefreshToken,
  getMenusByRoleId,
  saveUserLastLoginDate,
  deleteOldRefreshTokenByUserId,
  isEmailVerified,
  verifyAccountEmail,
  doesEmailExist,
  setupUserPassword,
  setupSchoolProfile,
  checkIfSchoolExists,
  addAdminStaff,
  addStaticSchoolRoles,
  updateSchoolUserId,
} = require("./auth-repository");
const { v4: uuidV4 } = require("uuid");
const { env, db } = require("../../config");
const { insertRefreshToken, findUserById } = require("../../shared/repository");
const { schoolProfileCreatedTemplate } = require("../../templates");

const PWD_SETUP_EMAIL_SEND_SUCCESS =
  "Password setup link emailed successfully.";
const USER_DOES_NOT_EXIST = "User does not exist";
const EMAIL_NOT_VERIFIED =
  "Email not verified yet. Please verify your email first.";
const USER_ALREADY_ACTIVE = "User already in active status. Please login.";
const UNABLE_TO_VERIFY_EMAIL = "Unable to verify email";

const login = async (username, passwordFromUser) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const user = await findUserByUsername({ username, client });
    if (!user) {
      throw new ApiError(400, "Invalid credential");
    }

    const {
      id: userId,
      role_id: roleId,
      name,
      email,
      password: passwordFromDB,
      is_active,
      school_id: schoolId,
      roleName,
      staticRoleId,
    } = user;
    if (!is_active) {
      throw new ApiError(403, "Your account is disabled");
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
        staticRoleId,
      },
      env.JWT_ACCESS_TOKEN_SECRET,
      env.JWT_ACCESS_TOKEN_TIME_IN_MS
    );
    const refreshToken = generateToken(
      { id: userId, role: roleName, roleId: roleId, staticRoleId },
      env.JWT_REFRESH_TOKEN_SECRET,
      env.JWT_REFRESH_TOKEN_TIME_IN_MS
    );

    await deleteOldRefreshTokenByUserId({ userId, client });
    await insertRefreshToken({ userId, refreshToken, schoolId, client });
    await saveUserLastLoginDate({ userId, client, schoolId });

    const permissions = await getMenusByRoleId({
      staticRoleId,
      roleId,
      schoolId,
      client,
    });
    const { hierarchialMenus, apis, uis } = formatMyPermission(permissions);

    await client.query("COMMIT");

    const accountBasic = {
      id: userId,
      roleId: staticRoleId,
      name,
      email,
      role: roleName,
      menus: hierarchialMenus,
      uis,
      apis,
      appBase: staticRoleId === 1 ? "/admin" : "/app",
    };

    return { accessToken, refreshToken, csrfToken, accountBasic };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const logout = async (refreshToken) => {
  const affectedRow = await invalidateRefreshToken(refreshToken);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to logout");
  }
  return { message: "Logged out successfully" };
};

const getNewAccessAndCsrfToken = async (refreshToken) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const decodedToken = verifyToken(
      refreshToken,
      env.JWT_REFRESH_TOKEN_SECRET
    );
    if (!decodedToken || !decodedToken.id) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new ApiError(401, "Token does not exist");
    }

    const {
      id: userId,
      role_id: roleId,
      is_active,
      school_id: schoolId,
      staticRoleId,
      roleName,
    } = user;
    if (!is_active) {
      throw new ApiError(401, "Your account is disabled");
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
        staticRoleId,
      },
      env.JWT_ACCESS_TOKEN_SECRET,
      env.JWT_ACCESS_TOKEN_TIME_IN_MS
    );

    await client.query("COMMIT");

    return {
      accessToken,
      csrfToken,
      message: "Refresh-token and csrf-token generated successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const processAccountEmailVerify = async (userId) => {
  const EMAIL_VERIFIED_AND_EMAIL_SEND_SUCCESS =
    "Email verified successfully. Please setup password using link provided in the email.";
  const EMAIL_VERIFIED_BUT_EMAIL_SEND_FAIL =
    "Email verified successfully but fail to send password setup email.";
  try {
    const isEmailAlreadyVerified = await isEmailVerified(userId);
    if (isEmailAlreadyVerified) {
      throw new ApiError(400, "Email already verified");
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

const processPasswordSetup = async (payload) => {
  const { userId, userEmail, password } = payload;

  const totalEmail = await doesEmailExist({ userId, userEmail });
  if (totalEmail <= 0) {
    throw new ApiError(404, "Bad request");
  }

  const hashedPassword = await generateHashedPassword(password);
  const affectedRow = await setupUserPassword({
    userId,
    userEmail,
    password: hashedPassword,
  });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to setup password");
  }

  return {
    message:
      "Password setup successful. Please login now using your email and password.",
  };
};

const processResendEmailVerification = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, USER_DOES_NOT_EXIST);
    }

    const { email, is_email_verified, is_active } = user;
    if (is_active) {
      throw new ApiError(400, USER_ALREADY_ACTIVE);
    }

    if (is_email_verified) {
      throw new ApiError(
        400,
        "Email already verified. Please setup your account password using the link sent in the email."
      );
    }

    await sendAccountVerificationEmail({ userId, userEmail: email });
    return {
      message:
        "Verification email sent successfully. Please setup password using link provided in the email.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, "Unable to send verification email");
    }
  }
};

const processResendPwdSetupLink = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, USER_DOES_NOT_EXIST);
    }

    const { email, is_active, is_email_verified } = user;
    if (is_active) {
      throw new ApiError(400, USER_ALREADY_ACTIVE);
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
      throw new ApiError(500, "Unable to send password setup email");
    }
  }
};

const processPwdReset = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(404, USER_DOES_NOT_EXIST);
    }

    const { email, is_email_verified } = user;
    if (!is_email_verified) {
      throw new ApiError(400, EMAIL_NOT_VERIFIED);
    }

    await sendPasswordSetupEmail({ userId, userEmail: email });
    return { message: PWD_SETUP_EMAIL_SEND_SUCCESS };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, "Unable to reset password");
    }
  }
};

const sendSchoolRegistrationEmail = async ({ schoolId, schoolName, email }) => {
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: "School Profile Created",
    html: schoolProfileCreatedTemplate(schoolId, schoolName),
  };
  await sendMail(mailOptions);
};

const processSetupSchoolProfile = async (payload) => {
  const SCHOOL_PROFILE_CREATE_FAIL = "Unable to create school profile";
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const schoolId = await getSchoolId(client);
    const updatedPayload = {
      ...payload,
      schoolId,
    };
    const result = await setupSchoolProfile({
      payload: updatedPayload,
      client,
    });
    if (!result) {
      throw new ApiError(500, SCHOOL_PROFILE_CREATE_FAIL);
    }

    await sendSchoolRegistrationEmail({
      schoolId,
      schoolName: payload.name,
      email: payload.email,
    });

    await client.query("COMMIT");
    return {
      schoolId,
      message: "School profile created successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, SCHOOL_PROFILE_CREATE_FAIL);
    }
  } finally {
    client.release();
  }
};

const processSetupAdminProfile = async (payload) => {
  const ADMIN_PROFILE_ADD_FAIL = "Unable to add admin profile";
  const SCHOOL_NOT_FOUND = "School does not exist";
  const ADMIN_PROFILE_ADD_AND_VERIFICATION_EMAIL_SENT_SUCCESS =
    "Admin profile created. Please check your email to verify your account.";
  const ADMIN_PROFILE_ADD_SUCCESS_BUT_VERIFICATION_EMAIL_SENT_FAIL =
    "Admin profile created but fail to send account verification email.";

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const school = await checkIfSchoolExists({
      schoolId: payload.schoolId,
      client,
    });
    if (!school) {
      throw new ApiError(404, SCHOOL_NOT_FOUND);
    }

    const roles = await addStaticSchoolRoles({
      schoolId: payload.schoolId,
      client,
    });
    if (roles.length <= 0) {
      throw new ApiError(500, "Unable to add roles for the school");
    }

    const adminRoleId =
      roles.find((role) => role.static_role_id === 2)?.id || null;

    const updatedPayload = {
      ...payload,
      role: adminRoleId,
    };
    const result = await addAdminStaff({ payload: updatedPayload, client });
    if (!result.status) {
      throw new ApiError(500, result.message);
    }

    try {
      await sendAccountVerificationEmail({
        userId: result.userId,
        userEmail: school.email,
      });

      await updateSchoolUserId({
        lastModifieddBy: result.userId,
        schoolId: payload.schoolId,
        client,
      });

      await client.query("COMMIT");

      return { message: ADMIN_PROFILE_ADD_AND_VERIFICATION_EMAIL_SENT_SUCCESS };
    } catch (error) {
      throw new ApiError(
        500,
        ADMIN_PROFILE_ADD_SUCCESS_BUT_VERIFICATION_EMAIL_SENT_FAIL
      );
    }
  } catch (error) {
    await client.query("ROLLBACK");
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, ADMIN_PROFILE_ADD_FAIL);
    }
  } finally {
    client.release();
  }
};

module.exports = {
  login,
  logout,
  getNewAccessAndCsrfToken,
  processAccountEmailVerify,
  processPasswordSetup,
  processResendEmailVerification,
  processResendPwdSetupLink,
  processPwdReset,
  processSetupSchoolProfile,
  processSetupAdminProfile,
};
