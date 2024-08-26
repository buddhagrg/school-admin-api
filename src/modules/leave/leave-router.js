const express = require("express");
const router = express.Router();
const leaveController = require("./leave-controller");

router.post("/policies", leaveController.handleMakeNewPolicy);
router.get("/policies", leaveController.handleGetLeavePolicies);
router.get("/policies/me", leaveController.handleGetMyLeavePolicy);
router.put("/policies/:id", leaveController.handleUpdateLeavePlicy);
router.post("/policies/:id/status", leaveController.handleReviewLeavePolicy);
router.post("/policies/:id/users", leaveController.handleUpdatePolicyUsers);
router.get("/policies/:id/users", leaveController.handleGetPolicyUsers);
router.delete("/policies/:id/users", leaveController.handleRemovePolicyUser);
router.get("/policies/eligible-users", leaveController.handleFetchPolicyEligibleUsers);

router.get("/request", leaveController.handleGetUserLeaveHistory);
router.post("/request", leaveController.handleCreateNewLeaveRequest);
router.put("/request/:id", leaveController.handleUpdateLeaveRequest);
router.delete("/request/:id", leaveController.handleDeleteLeaveRequest);

router.get("/pending", leaveController.handleFetchPendingLeaveRequests);
router.post("/pending/:id/status", leaveController.handleReviewLeaveRequest);

module.exports = { leaveRoutes: router };
