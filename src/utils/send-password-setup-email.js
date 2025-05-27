import { env } from '../config/index.js';
import { sendMail } from './send-email.js';
import { pwdSetupTemplate } from '../templates/index.js';
import { generatePwdSetupEmail } from './token-services.js';
import { getDateDistanceInWords } from './date-utils.js';

export const sendPasswordSetupEmail = async ({ email, tokenPayload }) => {
  const token = generatePwdSetupEmail(tokenPayload);
  const expiry = getDateDistanceInWords(env.PASSWORD_MANAGE_TOKEN_TIME_IN_MS);
  const link = `${env.UI_URL}/setup-password?token=${token}`;
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: 'Email Verified Successfully – Set Your Password',
    html: pwdSetupTemplate(link, expiry)
  };
  await sendMail(mailOptions);
};
