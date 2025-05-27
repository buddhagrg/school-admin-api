import { env } from '../../../config/env.js';
import {
  generatePasswordResetToken,
  getDateDistanceInWords,
  sendMail
} from '../../../utils/index.js';
import { pwdResetRequestTemplate } from './pwd-reset-request-template.js';

export const sendPasswordResetRequestEmail = async ({ email, tokenPayload }) => {
  const token = generatePasswordResetToken(tokenPayload);
  const link = `${env.UI_URL}/reset-password?token=${token}`;
  const expiry = getDateDistanceInWords(env.PASSWORD_MANAGE_TOKEN_TIME_IN_MS);
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: 'Reset Password',
    html: pwdResetRequestTemplate(link, expiry)
  };
  await sendMail(mailOptions);
};
