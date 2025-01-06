const express = require("express");
const router = express.Router();
const accessControlController = require("./access-control-controller");
const { isUserAdminOrSuperAdmin } = require("../../middlewares");

router.get("/me", accessControlController.handleGetMyAccessControl);

router.get(
  "",
  isUserAdminOrSuperAdmin([1, 2]),
  accessControlController.handleGetAllAccessControls
);
router.post(
  "/access-controls",
  isUserAdminOrSuperAdmin([1]),
  accessControlController.handleAddAccessControl
);
router.put(
  "/access-controls/:id",
  isUserAdminOrSuperAdmin([1]),
  accessControlController.handleUpdateAccessControl
);
router.delete(
  "/access-controls/:id",
  isUserAdminOrSuperAdmin([1]),
  accessControlController.handleDeleteAccessControl
);

module.exports = { accessControlRoutes: router };
