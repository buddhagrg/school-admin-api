const express = require("express");
const router = express.Router();
const staffController = require("./staff-controller");
const { checkApiAccess } = require("../../middlewares");

router.get("", checkApiAccess, staffController.handleGetStaff);
router.post("", checkApiAccess, staffController.handleAddStaff);
router.get("/:id", checkApiAccess, staffController.handleGetStaffDetail);
router.put("/:id", checkApiAccess, staffController.handleUpdateStaff);

module.exports = { staffRoutes: router };
