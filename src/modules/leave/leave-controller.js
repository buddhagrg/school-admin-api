import asyncHandler from 'express-async-handler';
import {
  processAddNewLeaveRequest,
  processUpdateLeaveStatus,
  processAddNewLeavePolicy,
  processGetLeavePolicies,
  processUpdateLeavePolicy,
  processLinkPolicyUsers,
  processGetPolicyUsers,
  processUnlinkPolicyUser,
  processGetPolicyEligibleUsers,
  processUpdateLeavePolicyStatus,
  processGetUserLeaveHistory,
  processDeleteLeaveRequest,
  processGetPendingLeaveRequests,
  processUpdateLeaveRequest,
  processGetMyLeavePolicy,
  processGetUserWithLeavePolicies,
  processApplyUserLeaveRequest
} from './leave-service.js';

export const handleAddNewLeavePolicy = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;
  const { schoolId } = req.user;
  const response = await processAddNewLeavePolicy({ name, schoolId, isActive });
  res.json(response);
});

export const handleGetLeavePolicies = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetLeavePolicies(schoolId);
  res.json(response);
});

export const handleGetMyLeavePolicy = asyncHandler(async (req, res) => {
  const { userId, schoolId } = req.user;
  const response = await processGetMyLeavePolicy({ userId, schoolId });
  res.json(response);
});

export const handleUpdateLeavePolicy = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processUpdateLeavePolicy({
    name,
    id,
    schoolId,
    isActive
  });
  res.json(response);
});

export const handleLinkPolicyUsers = asyncHandler(async (req, res) => {
  const { users } = req.body;
  const { id: policyId } = req.params;
  const { schoolId } = req.user;
  const response = await processLinkPolicyUsers({ policyId, users, schoolId });
  res.json(response);
});

export const handleGetPolicyUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processGetPolicyUsers({ id, schoolId });
  res.json(response);
});

export const handleUnlinkPolicyUser = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const { schoolId } = req.user;
  const response = await processUnlinkPolicyUser({ userId, id, schoolId });
  res.json(response);
});

export const handleGetPolicyEligibleUsers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetPolicyEligibleUsers(schoolId);
  res.json(response);
});

export const handleAddNewLeaveRequest = asyncHandler(async (req, res) => {
  const { userId, schoolId } = req.user;
  const { policyId, fromDate: from, toDate: to, note } = req.body;
  const response = await processAddNewLeaveRequest({
    policyId,
    from,
    to,
    note,
    userId,
    schoolId
  });
  res.json(response);
});

export const handleUpdateLeaveStatus = asyncHandler(async (req, res) => {
  const status = req.url.includes('approve') ? 'APPROVED' : 'REJECTED';
  const rejectionReason = status === 'REJECTED' ? req.body.note : '';
  const { userId: reviewerUserId, schoolId } = req.user;
  const { id: requestId } = req.params;
  const response = await processUpdateLeaveStatus({
    reviewerUserId,
    requestId,
    status,
    schoolId,
    rejectionReason
  });
  res.json(response);
});

export const handleUpdateLeavePolicyStatus = asyncHandler(async (req, res) => {
  const { id: policyId } = req.params;
  const { status } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateLeavePolicyStatus({
    status,
    policyId,
    schoolId
  });
  res.json(response);
});

export const handleUpdateLeaveRequest = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const body = req.body;
  const { id } = req.params;
  const payload = { ...body, id, schoolId };
  const response = await processUpdateLeaveRequest(payload);
  res.json(response);
});

export const handleGetUserLeaveHistory = asyncHandler(async (req, res) => {
  const { userId, schoolId } = req.user;
  const { policyId, statusId, fromDate, toDate } = req.query;
  const response = await processGetUserLeaveHistory({
    userId,
    schoolId,
    policyId,
    statusId,
    fromDate,
    toDate
  });
  res.json(response);
});

export const handleDeleteLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processDeleteLeaveRequest({ id, schoolId });
  res.json(response);
});

export const handleGetPendingLeaveRequests = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetPendingLeaveRequests(schoolId);
  res.json(response);
});

export const handleGetUserWithLeavePolicies = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: userId } = req.params;
  const response = await processGetUserWithLeavePolicies({ userId, schoolId });
  res.json(response);
});

export const handleApplyUserLeaveRequest = asyncHandler(async (req, res) => {
  const { schoolId, userId: reviewerId } = req.user;
  const { id: userId } = req.params;
  const { policyId, from, to, note } = req.body;
  const response = await processApplyUserLeaveRequest({
    policyId,
    reviewerId,
    from,
    to,
    note,
    userId,
    schoolId
  });
  res.json(response);
});
