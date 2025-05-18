import express from 'express';
import * as classTeacherController from './class-teachers.controller.js';

const router = express.Router();

router.get('', classTeacherController.handleGetAllClassTeachers);
router.post('/assign', classTeacherController.handleAssignClassTeacher);
router.put('/:id', classTeacherController.handleUpdateClassTeacher);

export { router as classTeacherRoute };
