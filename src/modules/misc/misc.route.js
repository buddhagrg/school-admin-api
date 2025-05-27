import express from 'express';
import * as miscController from './misc.controller.js';
import {
  authenticateAccessToken,
  authenticateCsrfToken,
  checkApiAccess
} from '../../middlewares/index.js';

const router = express.Router();

router.post('/contact-us', miscController.handleContactUs);
router.get(
  '/teachers',
  authenticateAccessToken,
  authenticateCsrfToken,
  checkApiAccess,
  miscController.handleGetAllTeachersOfSchool
);
router.get(
  '/dashboard',
  authenticateAccessToken,
  authenticateCsrfToken,
  checkApiAccess,
  miscController.handleGetDashboardData
);

export { router as miscRoutes };
