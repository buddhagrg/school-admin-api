const express = require("express");
const router = express.Router();
const leaveController = require("./leave-controller");
const { checkApiAccess } = require("../../middlewares");

router.post(
  "/policies",
  checkApiAccess,
  leaveController.handleAddNewLeavePolicy
);
router.get("/policies", checkApiAccess, leaveController.handleGetLeavePolicies);
router.get(
  "/policies/my",
  checkApiAccess,
  leaveController.handleGetMyLeavePolicy
);
router.put(
  "/policies/:id",
  checkApiAccess,
  leaveController.handleUpdateLeavePolicy
);
router.patch(
  "/policies/:id/status",
  checkApiAccess,
  leaveController.handleUpdateLeavePolicyStatus
);
router.put(
  "/policies/:id/users",
  checkApiAccess,
  leaveController.handleLinkPolicyUsers
);
router.get(
  "/policies/:id/users",
  checkApiAccess,
  leaveController.handleGetPolicyUsers
);
router.delete(
  "/policies/:id/users/:userId",
  checkApiAccess,
  leaveController.handleUnlinkPolicyUser
);
router.get(
  "/policies/eligible-users",
  checkApiAccess,
  leaveController.handleGetPolicyEligibleUsers
);

router.get(
  "/requests",
  checkApiAccess,
  leaveController.handleGetUserLeaveHistory
);
router.post(
  "/requests",
  checkApiAccess,
  leaveController.handleAddNewLeaveRequest
);
router.put(
  "/requests/:id",
  checkApiAccess,
  leaveController.handleUpdateLeaveRequest
);
router.delete(
  "/requests/:id",
  checkApiAccess,
  leaveController.handleDeleteLeaveRequest
);

router.get(
  "/requests/pending",
  checkApiAccess,
  leaveController.handleGetPendingLeaveRequests
);
router.patch(
  "/requests/pending/:id/status",
  checkApiAccess,
  leaveController.handleUpdatePendingLeaveRequestStatus
);

module.exports = { leaveRoutes: router };
