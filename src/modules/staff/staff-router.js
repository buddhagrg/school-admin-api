const express = require("express");
const router = express.Router();
const staffController = require("./staff-controller");
const { checkApiAccess } = require("../../middlewares");

router.post("", checkApiAccess, staffController.handleAddStaff);
router.get("/:id", checkApiAccess, staffController.handleGetStaff);
router.put("/:id", checkApiAccess, staffController.handleUpdateStaff);

module.exports = { staffRoutes: router };
