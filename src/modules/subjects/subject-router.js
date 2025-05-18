import express from 'express';
import * as subjectController from './subject-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.post('', checkApiAccess, subjectController.handleAddSubject);
router.get('', checkApiAccess, subjectController.handleGetAllSubjects);
router.put('', checkApiAccess, subjectController.handleUpdateSubject);
router.delete('', checkApiAccess, subjectController.handleDeleteSubject);

export { router as subjectRoutes };
