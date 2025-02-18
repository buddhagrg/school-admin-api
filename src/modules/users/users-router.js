const router = require("express").Router();
const userController = require("./users-controller");

router.get("", userController.handleGetUsers);
router.post("/:id/system-access", userController.handleUpdateUserSystemAccess);

module.exports = { userRoutes: router };
