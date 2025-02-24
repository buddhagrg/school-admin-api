const express = require("express");
const router = express.Router();
const roleController = require("./role-controller");

router.get("", roleController.handleGetRoles);
router.post("", roleController.handleAddRole);
router.put("/:id", roleController.handleUpdateRole);
router.patch("/:id/status", roleController.handleUpdateRoleStatus);
router.get("/:id/permissions", roleController.handleGetRolePermissions);
router.post("/:id/permissions", roleController.handleAssignPermissionsForRole);
router.delete("/:id/permissions", roleController.handleDeletePermissionsOfRole);
router.get("/:id/users", roleController.handleGetRoleUsers);

module.exports = { roleRoutes: router };
