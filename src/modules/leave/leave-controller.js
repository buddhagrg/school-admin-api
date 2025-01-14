const asyncHandler = require("express-async-handler");
const {
  addNewLeaveRequest,
  reviewPendingLeaveRequest,
  makeNewLeavePolicy,
  fetchLeavePolicies,
  updateLeavePolicy,
  updatePolicyUsers,
  fetchPolicyUsers,
  deletePolicyUser,
  fetchPolicyEligibleUsers,
  reviewLeavePolicy,
  getUserLeaveHistory,
  deleteLeaveRequest,
  fetchPendingLeaveRequests,
  updateLeaveRequest,
  processGetMyLeavePolicy,
} = require("./leave-service");

const handleMakeNewPolicy = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await makeNewLeavePolicy({ name, schoolId });
  res.json(response);
});

const handleGetLeavePolicies = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await fetchLeavePolicies(schoolId);
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
  const response = await updateLeavePolicy({ name, id, schoolId });
  res.json(response);
});

const handleUpdatePolicyUsers = asyncHandler(async (req, res) => {
  const { users } = req.body;
  const { id: policyId } = req.params;
  const { schoolId } = req.user;
  const response = await updatePolicyUsers({ policyId, users, schoolId });
  res.json(response);
});

const handleGetPolicyUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await fetchPolicyUsers({ id, schoolId });
  res.json(response);
});

const handleRemovePolicyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const { schoolId } = req.user;
  const response = await deletePolicyUser({ user, id, schoolId });
  res.json(response);
});

const handleFetchPolicyEligibleUsers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await fetchPolicyEligibleUsers(schoolId);
  res.json(response);
});

const handleCreateNewLeaveRequest = asyncHandler(async (req, res) => {
  const { id: userId, schoolId } = req.user;
  const { policy, from, to, note } = req.body;
  const response = await addNewLeaveRequest({
    policy,
    from,
    to,
    note,
    userId,
    schoolId,
  });
  res.json(response);
});

const handleReviewLeaveRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id: reviewerUserId, schoolId, roleId: reviewerRoleId } = req.user;
  const { id: requestId } = req.params;

  const response = await reviewPendingLeaveRequest({
    reviewerUserId,
    requestId,
    status,
    schoolId,
    reviewerRoleId,
  });
  res.json(response);
});

const handleReviewLeavePolicy = asyncHandler(async (req, res) => {
  const { id: policyId } = req.params;
  const { status } = req.body;
  const { schoolId } = req.user;

  const response = await reviewLeavePolicy({ status, policyId, schoolId });
  res.json(response);
});

const handleUpdateLeaveRequest = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const body = req.body;
  const { id } = req.params;
  const payload = { ...body, id, schoolId };

  const response = await updateLeaveRequest(payload);
  res.json(response);
});

const handleGetUserLeaveHistory = asyncHandler(async (req, res) => {
  const { id, schoolId } = req.user;
  const response = await getUserLeaveHistory({ id, schoolId });
  res.json(response);
});

const handleDeleteLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await deleteLeaveRequest({ id, schoolId });
  res.json(response);
});

const handleFetchPendingLeaveRequests = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await fetchPendingLeaveRequests(schoolId);
  res.json(response);
});

module.exports = {
  handleCreateNewLeaveRequest,
  handleReviewLeaveRequest,
  handleMakeNewPolicy,
  handleGetLeavePolicies,
  handleUpdateLeavePolicy,
  handleUpdatePolicyUsers,
  handleGetPolicyUsers,
  handleRemovePolicyUser,
  handleFetchPolicyEligibleUsers,
  handleReviewLeavePolicy,
  handleUpdateLeaveRequest,
  handleGetUserLeaveHistory,
  handleDeleteLeaveRequest,
  handleFetchPendingLeaveRequests,
  handleGetMyLeavePolicy,
};
