import express from 'express';
import * as attendanceController from './attendance-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.post('', checkApiAccess, attendanceController.handleRecordAttendance);
router.get('/students', checkApiAccess, attendanceController.handleGetStudentsForAttendance);
router.get(
  '/students/record',
  checkApiAccess,
  attendanceController.handleGetStudentsAttendanceRecord
);
router.get('/staff', checkApiAccess, attendanceController.handleGetStaffForAttendance);
router.get('/staff/record', checkApiAccess, attendanceController.handleGetStaffAttendanceRecord);
router.patch('/:id', checkApiAccess, attendanceController.handleUpdateAttendanceStatus);

export { router as attendanceRoutes };
