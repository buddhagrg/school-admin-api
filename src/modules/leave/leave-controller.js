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
  const newPolicy = await makeNewLeavePolicy({ name, schoolId });
  res.json(newPolicy);
});

const handleGetLeavePolicies = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const data = await fetchLeavePolicies(schoolId);
  res.json({ data });
});

const handleGetMyLeavePolicy = asyncHandler(async (req, res) => {
  const { id, schoolId } = req.user;
  const data = await processGetMyLeavePolicy({ id, schoolId });
  res.json({ data });
});

const handleUpdateLeavePolicy = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const { schoolId } = req.user;
  const updatedPolicy = await updateLeavePolicy({ name, id, schoolId });
  res.json(updatedPolicy);
});

const handleUpdatePolicyUsers = asyncHandler(async (req, res) => {
  const { users } = req.body;
  const { id: policyId } = req.params;
  const { schoolId } = req.user;
  const message = await updatePolicyUsers({ policyId, users, schoolId });
  res.json(message);
});

const handleGetPolicyUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const data = await fetchPolicyUsers({ id, schoolId });
  res.json({ data });
});

const handleRemovePolicyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const { schoolId } = req.user;
  const message = await deletePolicyUser({ user, id, schoolId });
  res.json(message);
});

const handleFetchPolicyEligibleUsers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const data = await fetchPolicyEligibleUsers(schoolId);
  res.json({ data });
});

const handleCreateNewLeaveRequest = asyncHandler(async (req, res) => {
  const { id: userId, schoolId } = req.user;
  const { policy, from, to, note } = req.body;
  const message = await addNewLeaveRequest({
    policy,
    from,
    to,
    note,
    userId,
    schoolId,
  });
  res.json(message);
});

const handleReviewLeaveRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id: reviewerUserId, schoolId, roleId: reviewerRoleId } = req.user;
  const { id: requestId } = req.params;

  const message = await reviewPendingLeaveRequest({
    reviewerUserId,
    requestId,
    status,
    schoolId,
    reviewerRoleId,
  });
  res.json(message);
});

const handleReviewLeavePolicy = asyncHandler(async (req, res) => {
  const { id: policyId } = req.params;
  const { status } = req.body;
  const { schoolId } = req.user;

  const message = await reviewLeavePolicy({ status, policyId, schoolId });
  res.json(message);
});

const handleUpdateLeaveRequest = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const body = req.body;
  const { id } = req.params;
  const payload = { ...body, id, schoolId };

  const message = await updateLeaveRequest(payload);
  res.json(message);
});

const handleGetUserLeaveHistory = asyncHandler(async (req, res) => {
  const { id, schoolId } = req.user;
  const data = await getUserLeaveHistory({ id, schoolId });
  res.json({ data });
});

const handleDeleteLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const message = await deleteLeaveRequest({ id, schoolId });
  res.json(message);
});

const handleFetchPendingLeaveRequests = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const data = await fetchPendingLeaveRequests(schoolId);
  res.json({ data });
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
