const express = require("express");
const router = express.Router();
const staffController = require("./staff-controller");

router.post("", staffController.handleAddStaff);
router.get("/:id", staffController.handleGetStaff);
router.put("/:id", staffController.handleUpdateStaff);

module.exports = { staffRoutes: router };
