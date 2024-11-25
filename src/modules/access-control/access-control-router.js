const express = require("express");
const router = express.Router();
const accessControlController = require("./access-control-controller");
const { isUserAdminOrSuperAdmin } = require("../../middlewares");

router.get(
  "",
  isUserAdminOrSuperAdmin([1, 2]),
  accessControlController.handleGetAllAccessControls
);
router.get("/me", accessControlController.handleGetMyAccessControl);

module.exports = { accessControlRoutes: router };
