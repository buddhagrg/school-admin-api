const router = require("express").Router();
const userController = require("./users-controller");

router.get("", userController.handleGetUsers);
router.patch("/:id/status", userController.handleUpdateUserSystemAccess);
router.patch("/:id/switch-role", userController.handleSwitchRole);

module.exports = { userRoutes: router };
