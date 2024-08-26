const express = require("express");
const router = express.Router();
const classesController = require("./classes-controller");

router.get("", classesController.handleFetchAllClasses);
router.get("/:id", classesController.handleFetchClassDetail);
router.post("", classesController.handleAddClass);
router.put("/:id", classesController.handleUpdateClass);
router.delete("/:id", classesController.handleDeleteClass);

module.exports = { classesRoutes: router };