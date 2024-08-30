const express = require("express");
const router = express.Router();
const { authenticateToken, csrfProtection, handleEmailVerificationToken, handlePasswordSetupToken } = require("../../middlewares");
const authController = require("./auth-controller");

router.post("/login", authController.handleLogin);
router.get("/refresh", authController.handleTokenRefresh);
router.post("/logout", authenticateToken, csrfProtection, authController.handleLogout);
router.get("/verify-email/:token", handleEmailVerificationToken, authController.handleAccountEmailVerify);
router.post("/setup-password", handlePasswordSetupToken, authController.handleAccountPasswordSetup);
router.post("/resend-email-verification", authenticateToken, csrfProtection, authController.handleResendEmailVerification);
router.post("/resend-pwd-setup-link", authenticateToken, csrfProtection, authController.handleResendPwdSetupLink);
router.post("/reset-pwd", authenticateToken, csrfProtection, authController.handlePwdReset);

module.exports = { authRoutes: router };
