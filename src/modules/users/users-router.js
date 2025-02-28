const router = require("express").Router();
const { checkApiAccess } = require("../../middlewares");
const userController = require("./users-controller");

router.get("", checkApiAccess, userController.handleGetUsers);
router.patch(
  "/:id/status",
  checkApiAccess,
  userController.handleUpdateUserSystemAccess
);
router.patch(
  "/:id/switch-role",
  checkApiAccess,
  userController.handleSwitchRole
);

module.exports = { userRoutes: router };
