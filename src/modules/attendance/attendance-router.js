const express = require("express");
const router = express.Router();
const attendanceController = require("./attendance-controller");

router.post("", attendanceController.handleAddOrUpdateAttendance);
router.get("/students", attendanceController.handleGetStudentsForAttendance);
router.get(
  "/students/record",
  attendanceController.handleGetStudentsAttendanceRecord
);
router.get("/staffs", attendanceController.handleGetStaffsForAttendance);
router.get(
  "/staffs/record",
  attendanceController.handleGetStaffsAttendanceRecord
);

module.exports = { attendanceRoutes: router };
