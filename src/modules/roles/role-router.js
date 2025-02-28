const express = require("express");
const router = express.Router();
const roleController = require("./role-controller");
const { checkApiAccess } = require("../../middlewares");

router.get("", checkApiAccess, roleController.handleGetRoles);
router.post("", checkApiAccess, roleController.handleAddRole);
router.put("/:id", checkApiAccess, roleController.handleUpdateRole);
router.patch(
  "/:id/status",
  checkApiAccess,
  roleController.handleUpdateRoleStatus
);
router.get(
  "/:id/permissions",
  checkApiAccess,
  roleController.handleGetRolePermissions
);
router.post(
  "/:id/permissions",
  checkApiAccess,
  roleController.handleAssignPermissionsForRole
);
router.delete(
  "/:id/permissions",
  checkApiAccess,
  roleController.handleDeletePermissionsOfRole
);
router.get("/:id/users", checkApiAccess, roleController.handleGetRoleUsers);

module.exports = { roleRoutes: router };
