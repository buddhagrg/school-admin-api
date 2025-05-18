import express from 'express';
import * as classController from './class-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.get('/sections', checkApiAccess, classController.handleGetClassesWithSections);
router.post('', checkApiAccess, classController.handleAddClass);
router.put('/:id', checkApiAccess, classController.handleUpdateClass);
router.post('/:id/sections', checkApiAccess, classController.handleAddSection);
router.put('/:id/sections/:sectionId', checkApiAccess, classController.handleUpdateSection);

export { router as classRoutes };
