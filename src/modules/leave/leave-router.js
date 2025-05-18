import express from 'express';
import * as leaveController from './leave-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.post('/policies', checkApiAccess, leaveController.handleAddNewLeavePolicy);
router.get('/policies', checkApiAccess, leaveController.handleGetLeavePolicies);
router.get('/policies/my', checkApiAccess, leaveController.handleGetMyLeavePolicy);
// router.get(
//   "/policies/users/:id",
//   checkApiAccess,
//   leaveController.handleGetUserWithLeavePolicies
// );
router.put('/policies/:id', checkApiAccess, leaveController.handleUpdateLeavePolicy);
// router.patch(
//   "/policies/:id/status",
//   checkApiAccess,
//   leaveController.handleUpdateLeavePolicyStatus
// );
router.put('/policies/:id/users', checkApiAccess, leaveController.handleLinkPolicyUsers);
router.get('/policies/:id/users', checkApiAccess, leaveController.handleGetPolicyUsers);
router.delete(
  '/policies/:id/users/:userId',
  checkApiAccess,
  leaveController.handleUnlinkPolicyUser
);
router.get(
  '/policies/eligible-users',
  checkApiAccess,
  leaveController.handleGetPolicyEligibleUsers
);
router.get('/requests', checkApiAccess, leaveController.handleGetUserLeaveHistory);
router.post('/requests', checkApiAccess, leaveController.handleAddNewLeaveRequest);
router.post('/requests/:id', checkApiAccess, leaveController.handleApplyUserLeaveRequest);
router.put('/requests/:id', checkApiAccess, leaveController.handleUpdateLeaveRequest);
router.delete('/requests/:id', checkApiAccess, leaveController.handleDeleteLeaveRequest);
router.get('/requests/pending', checkApiAccess, leaveController.handleGetPendingLeaveRequests);
router.patch(
  '/requests/pending/:id/reject',
  checkApiAccess,
  leaveController.handleUpdateLeaveStatus
);
router.patch(
  '/requests/pending/:id/approve',
  checkApiAccess,
  leaveController.handleUpdateLeaveStatus
);

export { router as leaveRoutes };
