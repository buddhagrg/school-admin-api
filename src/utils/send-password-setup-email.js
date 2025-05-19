import { env } from '../config/index.js';
import { generateToken } from './jwt-handle.js';
import { sendMail } from './send-email.js';
import { pwdSetupTemplate } from '../templates/index.js';

export const sendPasswordSetupEmail = async ({ email, demoId }) => {
  const token = generateToken(
    { demoId },
    env.PASSWORD_SETUP_TOKEN_SECRET,
    env.PASSWORD_SETUP_TOKEN_TIME_IN_MS
  );
  const link = `${env.UI_URL}/setup-password/${token}`;
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: 'Setup account password',
    html: pwdSetupTemplate(link)
  };
  await sendMail(mailOptions);
};
