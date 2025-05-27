import express from 'express';
import * as systemAccessController from './system-access-controller.js';
import { authenticateEmailVerificationToken } from '../../middlewares/index.js';

const router = express.Router();

router.post('/request', systemAccessController.handleRequestSystemAccess);
router.get(
  '/verify',
  authenticateEmailVerificationToken,
  systemAccessController.handleVerifySystemAccess
);

export { router as systemAccessRoutes };
