import express from 'express';
import { checkApiAccess } from '../../middlewares/index.js';
import * as levelController from './level-controller.js';

const router = express.Router();

router.get('', checkApiAccess, levelController.handleGetLevels);
router.post('', checkApiAccess, levelController.handleAddLevel);
router.put('/:id', checkApiAccess, levelController.handleUpdateLevel);
router.delete('/:id', checkApiAccess, levelController.handleDeleteLevel);
router.get('/:id/periods', levelController.handleGetPeriodsOfLevel);
router.post('/:id/periods', levelController.handleAddPeriod);
router.put('/:id/periods/:periodId', levelController.handleUpdatePeriod);
router.delete('/:id/periods/:periodId', levelController.handleDeletePeriod);
router.post('/:id/periods/reorder', checkApiAccess, levelController.handleReorderPeriods);

export { router as academicLevelRoutes };
