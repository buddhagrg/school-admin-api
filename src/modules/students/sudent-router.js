const express = require("express");
const router = express.Router();
const studentController = require("./student-controller");
const { checkApiAccess } = require("../../middlewares");

router.post("", checkApiAccess, studentController.handleAddStudent);
router.get("/:id", checkApiAccess, studentController.handleGetStudentDetail);
router.put("/:id", checkApiAccess, studentController.handleUpdateStudent);
router.get(
  "/:id/fees/due",
  checkApiAccess,
  studentController.handleGetStudentDueFees
);

module.exports = { studentRoutes: router };
