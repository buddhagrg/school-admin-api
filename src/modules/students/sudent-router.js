const express = require("express");
const router = express.Router();
const studentController = require("./student-controller");

router.post("", studentController.handleAddStudent);
router.get("/:id", studentController.handleGetStudentDetail);
router.put("/:id", studentController.handleUpdateStudent);
router.get("/:id/fees/due", studentController.handleGetStudentDueFees);

module.exports = { studentRoutes: router };
