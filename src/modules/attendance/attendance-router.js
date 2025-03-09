const express = require("express");
const router = express.Router();
const attendanceController = require("./attendance-controller");
const { checkApiAccess } = require("../../middlewares");

router.post(
  "",
  checkApiAccess,
  attendanceController.handleRecordAttendance
);
router.get(
  "/students",
  checkApiAccess,
  attendanceController.handleGetStudentsForAttendance
);
router.get(
  "/students/record",
  checkApiAccess,
  attendanceController.handleGetStudentsAttendanceRecord
);
router.get(
  "/staff",
  checkApiAccess,
  attendanceController.handleGetStaffForAttendance
);
router.get(
  "/staff/record",
  checkApiAccess,
  attendanceController.handleGetStaffAttendanceRecord
);

module.exports = { attendanceRoutes: router };
