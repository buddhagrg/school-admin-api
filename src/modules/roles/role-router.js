import express from 'express';
import * as roleController from './role-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.get('', checkApiAccess, roleController.handleGetRoles);
router.post('', checkApiAccess, roleController.handleAddRole);
router.put('/:id', checkApiAccess, roleController.handleUpdateRole);
router.patch('/:id/status', checkApiAccess, roleController.handleUpdateRoleStatus);
router.get('/:id/permissions', checkApiAccess, roleController.handleGetRolePermissions);
router.post('/:id/permissions', checkApiAccess, roleController.handleSaveRolePermissions);
router.get('/:id/users', checkApiAccess, roleController.handleGetRoleUsers);

export { router as roleRoutes };
