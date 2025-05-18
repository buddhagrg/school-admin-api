import express from 'express';
import * as schoolController from './school-controller.js';
import { isUserAdminOrSuperAdmin } from '../../middlewares/index.js';

const router = express.Router();

router.get(
  '/my',
  isUserAdminOrSuperAdmin(['SYSTEM_ADMIN', 'ADMIN']),
  schoolController.handleGetMySchool
);
router.put(
  '/my',
  isUserAdminOrSuperAdmin(['SYSTEM_ADMIN', 'ADMIN']),
  schoolController.handleUpdateMySchool
);
router.post('', isUserAdminOrSuperAdmin(['SYSTEM_ADMIN']), schoolController.handleAddSchool);
router.put(
  '/:id',
  isUserAdminOrSuperAdmin(['SYSTEM_ADMIN', 'ADMIN']),
  schoolController.handleUpdateSchool
);
router.get('', isUserAdminOrSuperAdmin(['SYSTEM_ADMIN']), schoolController.handleGetAllSchools);
router.get(
  '/:id',
  isUserAdminOrSuperAdmin(['SYSTEM_ADMIN', 'ADMIN']),
  schoolController.handleGetSchool
);
router.delete(
  '/:id',
  isUserAdminOrSuperAdmin(['SYSTEM_ADMIN']),
  schoolController.handleDeleteSchool
);

export { router as schoolRoutes };
