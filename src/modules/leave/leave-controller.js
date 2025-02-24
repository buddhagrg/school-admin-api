const asyncHandler = require("express-async-handler");
const {
  processAddNewLeaveRequest,
  processUpdatePendingLeaveRequestStatus,
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
} = require("./leave-service");

const handleAddNewLeavePolicy = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processAddNewLeavePolicy({ name, schoolId });
  res.json(response);
});

const handleGetLeavePolicies = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetLeavePolicies(schoolId);
  res.json(response);
});

const handleGetMyLeavePolicy = asyncHandler(async (req, res) => {
  const { id, schoolId } = req.user;
  const response = await processGetMyLeavePolicy({ id, schoolId });
  res.json(response);
});

const handleUpdateLeavePolicy = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processUpdateLeavePolicy({ name, id, schoolId });
  res.json(response);
});

const handleLinkPolicyUsers = asyncHandler(async (req, res) => {
  const { users } = req.body;
  const { id: policyId } = req.params;
  const { schoolId } = req.user;
  const response = await processLinkPolicyUsers({ policyId, users, schoolId });
  res.json(response);
});

const handleGetPolicyUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processGetPolicyUsers({ id, schoolId });
  res.json(response);
});

const handleUnlinkPolicyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const { schoolId } = req.user;
  const response = await processUnlinkPolicyUser({ userId, id, schoolId });
  res.json(response);
});

const handleGetPolicyEligibleUsers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetPolicyEligibleUsers(schoolId);
  res.json(response);
});

const handleAddNewLeaveRequest = asyncHandler(async (req, res) => {
  const { id: userId, schoolId } = req.user;
  const { policyId, from, to, note } = req.body;
  const response = await processAddNewLeaveRequest({
    policyId,
    from,
    to,
    note,
    userId,
    schoolId,
  });
  res.json(response);
});

const handleUpdatePendingLeaveRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id: reviewerUserId, schoolId, roleId: reviewerRoleId } = req.user;
  const { id: requestId } = req.params;

  const response = await processUpdatePendingLeaveRequestStatus({
    reviewerUserId,
    requestId,
    status,
    schoolId,
    reviewerRoleId,
  });
  res.json(response);
});

const handleUpdateLeavePolicyStatus = asyncHandler(async (req, res) => {
  const { id: policyId } = req.params;
  const { status } = req.body;
  const { schoolId } = req.user;

  const response = await processUpdateLeavePolicyStatus({
    status,
    policyId,
    schoolId,
  });
  res.json(response);
});

const handleUpdateLeaveRequest = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const body = req.body;
  const { id } = req.params;
  const payload = { ...body, id, schoolId };

  const response = await processUpdateLeaveRequest(payload);
  res.json(response);
});

const handleGetUserLeaveHistory = asyncHandler(async (req, res) => {
  const { id, schoolId } = req.user;
  const response = await processGetUserLeaveHistory({ id, schoolId });
  res.json(response);
});

const handleDeleteLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processDeleteLeaveRequest({ id, schoolId });
  res.json(response);
});

const handleGetPendingLeaveRequests = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetPendingLeaveRequests(schoolId);
  res.json(response);
});

module.exports = {
  handleAddNewLeaveRequest,
  handleUpdatePendingLeaveRequestStatus,
  handleAddNewLeavePolicy,
  handleGetLeavePolicies,
  handleUpdateLeavePolicy,
  handleLinkPolicyUsers,
  handleGetPolicyUsers,
  handleUnlinkPolicyUser,
  handleGetPolicyEligibleUsers,
  handleUpdateLeavePolicyStatus,
  handleUpdateLeaveRequest,
  handleGetUserLeaveHistory,
  handleDeleteLeaveRequest,
  handleGetPendingLeaveRequests,
  handleGetMyLeavePolicy,
};
