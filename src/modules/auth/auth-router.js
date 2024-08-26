const express = require("express");
const router = express.Router();
const { authenticateToken, csrfProtection, handleEmailVerificationToken, handlePasswordSetupToken } = require("../../middlewares");
const authController = require("./auth-controller");

router.post("/login", authController.handleLogin);
router.post("/logout", authenticateToken, csrfProtection, authController.handleLogout);
router.get("/refresh", authController.handleTokenRefresh);
router.get("/verify-email/:token", handleEmailVerificationToken, authController.handleAccountEmailVerify);
router.post("/setup-password", handlePasswordSetupToken, authController.handleAccountPasswordSetup);

module.exports = { authRoutes: router };
