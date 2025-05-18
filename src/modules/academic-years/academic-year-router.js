import express from 'express';
import { checkApiAccess } from '../../middlewares/index.js';
import * as academicYearController from './academic-year-controller.js';

const router = express.Router();

router.get('', checkApiAccess, academicYearController.handleGetAllAcademicYears);
router.post('', checkApiAccess, academicYearController.handleAddAcademicYear);
router.put('/:id', checkApiAccess, academicYearController.handleUpdatelAcademicYear);

export { router as academicYearRoutes };
