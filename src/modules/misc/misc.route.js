const express = require("express");
const router = express.Router();
const miscController = require("./misc.controller");
const {
  authenticateToken,
  csrfProtection,
  checkApiAccess,
} = require("../../middlewares");

router.post("/contact-us", miscController.handleContactUs);
router.get(
  "/teachers",
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  miscController.handleGetAllTeachersOfSchool
);
router.get(
  "/dashboard",
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  miscController.handleGetDashboardData
);

module.exports = { miscRoutes: router };
