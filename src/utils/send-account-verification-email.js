import { env } from '../config/index.js';
import { sendMail } from './send-email.js';
import { generateVerifyAccountToken } from './token-services.js';
import { emailVerificationTemplate } from '../templates/index.js';
import { getDateDistanceInWords } from './date-utils.js';

export const sendAccountVerificationEmail = async ({ tokenPayload, email }) => {
  const pwdToken = generateVerifyAccountToken(tokenPayload);
  const expiry = getDateDistanceInWords(env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS);
  const link = `${env.API_URL}/v1/auth/email/verify?token=${pwdToken}`;
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: 'Welcome! Please Confirm Your Email to Get Started',
    html: emailVerificationTemplate(link, expiry)
  };
  await sendMail(mailOptions);
};
