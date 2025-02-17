const express = require("express");
const router = express.Router();
const staffController = require("./staff-controller");

router.get("", staffController.handleGetAllStaff);
router.post("", staffController.handleAddStaff);
router.get("/:id", staffController.handleGetStaff);
router.put("/:id", staffController.handleUpdateStaff);
router.post("/:id/status", staffController.handleReviewStaffStatus);

module.exports = { staffRoutes: router };
