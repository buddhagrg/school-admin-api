import express from 'express';
import {
  authenticateToken,
  csrfProtection,
  handleEmailVerificationToken,
  handlePasswordSetupToken,
  checkApiAccess
} from '../../middlewares/index.js';
import * as authController from './auth-controller.js';
import { validateRequest } from '../../utils/index.js';
import { LoginSchema } from './auth-schema.js';

const router = express.Router();

router.post('/login', validateRequest(LoginSchema), authController.handleLogin);
router.get('/refresh', authController.handleTokenRefresh);
router.post('/logout', authenticateToken, csrfProtection, authController.handleLogout);
router.get(
  '/verify-email/:token',
  handleEmailVerificationToken,
  authController.handleAccountEmailVerify
);
router.post('/set-password', handlePasswordSetupToken, authController.handleAccountPasswordSetup);
router.post(
  '/resend-email-verification',
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  authController.handleResendEmailVerification
);
router.post(
  '/resend-pwd-setup-link',
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  authController.handleResendPwdSetupLink
);
router.post(
  '/reset-pwd',
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  authController.handlePwdReset
);
router.post('/school-profile', authController.handleSetupSchoolProfile);
router.post('/admin-profile', authController.handleSetupAdminProfile);

export { router as authRoutes };
