const router = require("express").Router();
const userController = require("./users-controller");

router.get("", userController.handleGetUsers);

module.exports = { userRoutes: router };
