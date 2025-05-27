import express from 'express';
import {
  authenticateAccessToken,
  authenticateCsrfToken,
  authenticateEmailVerificationToken,
  authenticatePwdManageToken,
  checkApiAccess,
  authenticateRefreshToken
} from '../../middlewares/index.js';
import * as authController from './auth-controller.js';
import { validateRequest } from '../../utils/index.js';
import { LoginSchema } from './auth-schema.js';

const router = express.Router();

router.post('/login', validateRequest(LoginSchema), authController.handleLogin);
router.get('/refresh', authenticateRefreshToken, authController.handleTokenRefresh);
router.post('/logout', authenticateAccessToken, authenticateCsrfToken, authController.handleLogout);
router.get(
  '/email/verify',
  authenticateEmailVerificationToken,
  authController.handleAccountEmailVerify
);
router.post(
  '/email/resend-verification',
  authenticateAccessToken,
  authenticateCsrfToken,
  checkApiAccess,
  authController.handleResendEmailVerification
);
router.post(
  '/password/resend-setup-link',
  authenticateAccessToken,
  authenticateCsrfToken,
  checkApiAccess,
  authController.handleResendPwdSetupLink
);
router.post('/password/reset/request', authController.handleRequestPwdReset);
router.patch('/password/reset/confirm', authenticatePwdManageToken, authController.handlePwdReset);
router.post('/password/setup', authenticatePwdManageToken, authController.handleSetupPassword);

export { router as authRoutes };
