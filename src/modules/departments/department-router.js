import express from 'express';
import * as departmentController from './department-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.get('', checkApiAccess, departmentController.handleGetAllDepartments);
router.post('', checkApiAccess, departmentController.handleAddNewDepartment);
router.put('/:id', checkApiAccess, departmentController.handleUpdateDepartmentById);
router.delete('/:id', checkApiAccess, departmentController.handleDeleteDepartmentById);

export { router as departmentRoutes };
