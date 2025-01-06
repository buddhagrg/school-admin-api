const express = require("express");
const router = express.Router();
const schoolController = require("./school-controller");

router.post("", schoolController.handleAddSchool);
router.put("/:id", schoolController.handleUpdateSchool);
router.get("", schoolController.handleGetAllSchools);
router.get("/:id", schoolController.handleGetSchool);
router.delete("/:id", schoolController.handleDeleteSchool);

module.exports = { schoolRoutes: router };
