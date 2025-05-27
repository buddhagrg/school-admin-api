import { createHmac } from 'crypto';
import { env } from '../config/index.js';

export const generateCsrfHmacHash = (csrfToken) => {
  const hash = createHmac('sha256', env.CSRF_TOKEN_SECRET).update(csrfToken).digest('hex');
  return hash;
};
