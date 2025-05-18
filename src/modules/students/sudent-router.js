import express from 'express';
import * as studentController from './student-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.get('', checkApiAccess, studentController.handleGetStudents);
router.post('', checkApiAccess, studentController.handleAddStudent);
router.get('/:id', checkApiAccess, studentController.handleGetStudentDetail);
router.put('/:id', checkApiAccess, studentController.handleUpdateStudent);
router.patch('/:id/status', checkApiAccess, studentController.handleUpdateStudentSystemStatus);
router.get('/:id/fees/due', checkApiAccess, studentController.handleGetStudentDueFees);

export { router as studentRoutes };
