import { env } from '../../../config/env.js';
import { emailVerificationTemplate } from '../../../templates/index.js';
import {
  sendMail,
  generateVerifyAccountToken,
  getDateDistanceInWords
} from '../../../utils/index.js';

export const sendSystemAccessVerificationEmail = async ({ tokenPayload, email }) => {
  const token = generateVerifyAccountToken(tokenPayload);
  const link = `${env.API_URL}/v1/system-access/verify?token=${token}`;
  const expiry = getDateDistanceInWords(env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS);
  const mailOptions = {
    from: env.MAIL_FROM_USER,
    to: email,
    subject: 'Verify Email',
    html: emailVerificationTemplate(link, expiry)
  };
  await sendMail(mailOptions);
};
