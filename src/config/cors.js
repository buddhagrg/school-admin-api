import cors from 'cors';
import { env } from './env.js';

export const corsPolicy = cors({
  origin: env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()),
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'X-CSRF-TOKEN'],
  credentials: true
});
