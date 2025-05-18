import { env } from '../config/index.js';
import { generateToken } from './jwt-handle.js';
import { sendMail } from './send-email.js';
import { emailVerificationTemplate } from '../templates/index.js';

export const sendAccountVerificationEmail = async ({ userId, userEmail }) => {
  const pwdToken = generateToken(
    { id: userId },
    env.EMAIL_VERIFICATION_TOKEN_SECRET,
    env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS
  );
  const link = `${env.API_URL}/v1/auth/verify-email/${pwdToken}`;
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: userEmail,
    subject: 'Verify account',
    html: emailVerificationTemplate(link)
  };
  await sendMail(mailOptions);
};
