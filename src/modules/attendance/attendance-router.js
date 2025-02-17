const express = require("express");
const router = express.Router();
const attendanceController = require("./attendance-controller");

router.post("", attendanceController.handleAddOrUpdateAttendance);
router.get("/students", attendanceController.handleGetStudentsForAttendance);
router.get(
  "/students/record",
  attendanceController.handleGetStudentsAttendanceRecord
);
router.get("/staff", attendanceController.handleGetStaffForAttendance);
router.get(
  "/staff/record",
  attendanceController.handleGetStaffAttendanceRecord
);

module.exports = { attendanceRoutes: router };
