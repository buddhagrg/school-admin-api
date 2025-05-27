import express from 'express';
import * as staffController from './staff-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.get('', checkApiAccess, staffController.handleGetAllStaff);
router.post('', checkApiAccess, staffController.handleAddStaff);
router.get('/:id', checkApiAccess, staffController.handleGetStaffDetail);
router.put('/:id', checkApiAccess, staffController.handleUpdateStaff);
router.patch('/:id/status', checkApiAccess, staffController.handleUpdateStaffStatus);

export { router as staffRoutes };
