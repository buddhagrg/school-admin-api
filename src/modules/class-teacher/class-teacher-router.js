const express = require("express");
const router = express.Router();
const classTeacherController = require("./class-teacher-controller");

router.get("", classTeacherController.handleGetClassTeachers);
router.post("", classTeacherController.handleAddClassTeacher);
router.get("/:id", classTeacherController.handleGetClassTeacherDetail);
router.put("/:id", classTeacherController.handleUpdateClassTeacherDetail);

module.exports = { classTeacherRoutes: router };
