import express from 'express';
import * as accountController from './account-controller.js';

const router = express.Router();

router.post('/change-password', accountController.handlePasswordChange);
router.get('/me', accountController.handleGetAccountDetail);
export { router as accountRoutes };
