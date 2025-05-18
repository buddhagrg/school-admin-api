import express from 'express';
import * as permissionController from './permission-controller.js';
import { isUserAdminOrSuperAdmin } from '../../middlewares/index.js';

const router = express.Router();

// router.get("/my", permissionController.handleGetMyPermissions);
router.get(
  '',
  isUserAdminOrSuperAdmin(['SYSTEM_ADMIN', 'ADMIN']),
  permissionController.handleGetAllPermissions
);
router.post('', isUserAdminOrSuperAdmin(['ADMIN']), permissionController.handleAddPermission);
router.put('/:id', isUserAdminOrSuperAdmin(['ADMIN']), permissionController.handleUpdatePermission);
router.delete(
  '/:id',
  isUserAdminOrSuperAdmin(['ADMIN']),
  permissionController.handleDeletePermission
);

export { router as permissionRoutes };
