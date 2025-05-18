import express from 'express';
import * as miscController from './misc.controller.js';
import { authenticateToken, csrfProtection, checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.post('/contact-us', miscController.handleContactUs);
router.get(
  '/teachers',
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  miscController.handleGetAllTeachersOfSchool
);
router.get(
  '/dashboard',
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  miscController.handleGetDashboardData
);

export { router as miscRoutes };
