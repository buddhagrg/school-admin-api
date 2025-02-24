const express = require("express");
const router = express.Router();
const permissionController = require("./permission-controller");
const { isUserAdminOrSuperAdmin } = require("../../middlewares");

// router.get("/my", permissionController.handleGetMyPermissions);

router.get(
  "",
  isUserAdminOrSuperAdmin([1, 2]),
  permissionController.handleGetAllPermissions
);
router.post(
  "",
  isUserAdminOrSuperAdmin([1]),
  permissionController.handleAddPermission
);
router.put(
  "/:id",
  isUserAdminOrSuperAdmin([1]),
  permissionController.handleUpdatePermission
);
router.delete(
  "/:id",
  isUserAdminOrSuperAdmin([1]),
  permissionController.handleDeletePermission
);

module.exports = { permissionRoutes: router };
