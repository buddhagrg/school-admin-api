const express = require("express");
const router = express.Router();
const roleController = require("./role-controller");

router.get("", roleController.handleGetRoles);
router.post("", roleController.handleAddRole);
router.post("/switch", roleController.handleSwitchRole);
router.put("/:id", roleController.handleUpdateRole);
router.post("/:id/status", roleController.handleRoleStatus);
router.get("/:id/permissions", roleController.handleGetRolePermission);
router.post("/:id/permissions", roleController.handleAddRolePermission);
router.get("/:id/users", roleController.handleGetUsersByRoleId);

module.exports = { roleRoutes: router };
