import { Resend } from 'resend';
import { env } from '../config/index.js';
import { ApiError } from './api-error.js';

export const sendMail = async (mailOptions) => {
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send(mailOptions);
  if (error) {
    throw new ApiError(500, 'Unable to send email');
  }
};
