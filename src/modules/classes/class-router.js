const express = require("express");
const router = express.Router();
const classController = require("./class-controller");
const { checkApiAccess } = require("../../middlewares");

router.get("", checkApiAccess, classController.handleFetchAllClasses);
router.get("/:id", checkApiAccess, classController.handleFetchClassDetail);
router.post("", checkApiAccess, classController.handleAddClass);
router.put("/:id", checkApiAccess, classController.handleUpdateClass);
router.delete("/:id", checkApiAccess, classController.handleDeleteClass);

module.exports = { classRoutes: router };
