import { db, env } from '../../config/index.js';
import { DB_TXN } from '../../constants/index.js';
import {
  accountVerificationInviteTemplate,
  directAccessRequestDenied,
  directAccessRequestApproved
} from '../../templates/index.js';
import {
  generateToken,
  sendMail,
  sendPasswordSetupEmail,
  generateHashedPassword,
  ApiError
} from '../../utils/index.js';
import {
  bookDemo,
  updateDemoDetail,
  updateDemoDateTime,
  updateStatusAndGetDemoDetail,
  manageDirectAccessRequest,
  confirmInvite,
  passwordSetup
} from './demo-repository.js';

export const processBookDemo = async (payload) => {
  //todo
  //need to integrate react-calendly for calendar invite email sed for demo date time
  const status = 'DEMO_CONFIRMATION_REQUEST_SENT';
  const affectedRow = await bookDemo({ ...payload, status });
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to save demo request');
  }
  return { message: 'Demo request saved successfully' };
};

export const processRequestAcountSetupAccess = async (payload) => {
  const status = 'ACCOUNT_SETUP_REQUEST_RECEIVED';
  const affectedRow = await bookDemo({ ...payload, status });
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to request direct system access');
  }
  return { message: 'Direct system access requested successfully' };
};

export const processUpdateDemoDetail = async (payload) => {
  const affectedRow = await updateDemoDetail(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update demo detail');
  }
  return { message: 'Demo detail updated successfully' };
};

export const processUpdateDemoDateTime = async (payload) => {
  const affectedRow = await updateDemoDateTime(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update demo date-time');
  }
  return { message: 'Demo date-time updated successfully' };
};

export const sendAccountVerificationInviteEmail = async (demoId, email) => {
  const token = generateToken(
    { demoId },
    env.EMAIL_VERIFICATION_TOKEN_SECRET,
    env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS
  );
  const link = `${env.API_URL}/v1/demo-requests/confirm-invite/${token}`;
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: `Thank You for Attending the Demo – Let Us Know Your Interest`,
    html: accountVerificationInviteTemplate(link)
  };
  await sendMail(mailOptions);
};

export const processInviteUser = async (demoId) => {
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const demo = await updateStatusAndGetDemoDetail(demoId, client);
    if (!demo || !demo.email) {
      throw new ApiError(404, 'Demo ID not found');
    }
    await sendAccountVerificationInviteEmail(demo.id, email);
    await client.query(DB_TXN.COMMIT);
    return {
      message: 'Follow-up email sent successfully.'
    };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    if (error instanceof ApiError) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, 'Failed to send follow-up email. Please try again later.');
    }
  } finally {
    client.release();
  }
};

export const sendDirectAccessAccountVerificationEmail = async (demoId, email) => {
  const token = generateToken(
    { demoId },
    env.EMAIL_VERIFICATION_TOKEN_SECRET,
    env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS
  );
  const link = `${env.API_URL}/v1/demo-requests/confirm-invite/${token}`;
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: 'Access Request Approved – Verify your account',
    html: directAccessRequestApproved(link)
  };
  await sendMail(mailOptions);
};

export const sendDirectAccessDeniedEmail = async (email) => {
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: 'Access Request Denied',
    html: directAccessRequestDenied()
  };
  await sendMail(mailOptions);
};

export const processApproveDirectAccessRequest = async (demoId) => {
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const payload = {
      demoId,
      status: 'ACCOUNT_VERIFICATION_EMAIL_SENT'
    };
    const affectedRow = await manageDirectAccessRequest(payload, client);
    if (affectedRow <= 0) {
      throw new ApiError(404, 'Demo ID not found');
    }
    await sendDirectAccessAccountVerificationEmail(demoId, email);
    await client.query(DB_TXN.COMMIT);
    return {
      message: `Invitation verification email sent successfully.
      Please check your inbox to complete the registration process.`
    };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    if (error instanceof ApiError) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, 'Failed to approve access request. Please try again later.');
    }
  } finally {
    client.release();
  }
};

export const processDenyDirectAccessRequest = async (demoId) => {
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const payload = {
      demoId,
      status: 'ACCOUNT_SETUP_REQUEST_DENIED'
    };
    const affectedRow = await manageDirectAccessRequest(payload, client);
    if (affectedRow <= 0) {
      throw new ApiError(404, 'Demo ID not found');
    }
    await sendDirectAccessDeniedEmail(email);
    await client.query(DB_TXN.COMMIT);
    return {
      message: 'Access request has been denied. Please contact support for more details.'
    };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    if (error instanceof ApiError) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, 'Failed to deny access request. Please try again later.');
    }
  } finally {
    client.release();
  }
};

export const processConfirmInvite = async (demoId) => {
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const affectedRow = await confirmInvite(demoId, client);
    if (affectedRow <= 0) {
      throw new ApiError(404, 'Demo ID not found');
    }
    await sendPasswordSetupEmail({ email, demoId });
    await client.query(DB_TXN.COMMIT);
    return {
      message: 'Password setup email sent successfully.'
    };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    if (error instanceof ApiError) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, 'Failed to confirm invite. Please try again later.');
    }
  } finally {
    client.release();
  }
};

export const processPasswordSetup = async (payload) => {
  const { demoId, password } = payload;
  const hashedPassword = await generateHashedPassword(password);
  const result = await passwordSetup({ demoId, hashedPassword });
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};
