import express from 'express';
import * as demoController from './demo-controller.js';
import { handleEmailVerificationToken } from '../../middlewares/index.js';

const router = express.Router();

// router.post('', demoController.handleBookDemo);
// router.patch('/:id', demoController.handleUpdateDemoDateTime);
// router.post('/:id/invite-user', demoController.handleInviteUser); //follow-up email after demo completed
router.get(
  '/confirm-invite/:token',
  handleEmailVerificationToken,
  demoController.handleConfirmInvite
);
router.post('/request-access', demoController.handleRequestAcountSetupAccess);
// router.patch('/:id/approve-access', demoController.handleApproveAccessRequest);
// router.patch('/:id/deny-access', demoController.handleDenyAccessRequest);
// router.put('/:id', authenticateToken, demoController.handleUpdateDemoDetail);

export { router as demoRoutes };
