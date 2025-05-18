import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { handle404Error, handleGlobalError } from './middlewares/index.js';
import { v1Routes } from './routes/v1.js';
import { cors } from './config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser());
app.use('/v1', v1Routes);
app.use(handle404Error);
app.use(handleGlobalError);

export { app };
