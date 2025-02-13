const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  createNewLeavePolicy,
  updateLeavePolicyById,
  getLeavePolicies,
  getUsersByPolicyId,
  updatePolicyUsersById,
  enableDisableLeavePolicy,
  deleteUserFromPolicyById,
  getPolicyEligibleUsers,
  createNewLeaveRequest,
  updateLeaveRequestById,
  getLeaveRequestHistoryByUser,
  deleteLeaveRequestByRequestId,
  getPendingLeaveRequests,
  approveOrCancelPendingLeaveRequest,
  findReviewerIdByRequestId,
  getMyLeavePolicy,
  findPolicyStatusById,
} = require("./leave-repository");

const checkIfPolicyIsActive = async (id) => {
  const policy = await findPolicyStatusById(id);
  if (!policy.is_active)
    throw new ApiError(
      403,
      "Policy is not active. Please activate the policy first."
    );
};

const makeNewLeavePolicy = async (payload) => {
  const affectedRow = await createNewLeavePolicy(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add policy");
  }
  return { message: "Policy added successfully" };
};

const updateLeavePolicy = async ({ name, id, schoolId }) => {
  await checkIfPolicyIsActive(id);
  const affectedRow = await updateLeavePolicyById({ name, id, schoolId });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update policy");
  }
  return { message: "Policy updated successfully" };
};

const fetchLeavePolicies = async (schoolId) => {
  const leavePolicies = await getLeavePolicies(schoolId);
  if (!Array.isArray(leavePolicies) || leavePolicies.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { leavePolicies };
};

const processGetMyLeavePolicy = async ({ id, schoolId }) => {
  const myLeavePolicies = await getMyLeavePolicy({ id, schoolId });
  if (!Array.isArray(myLeavePolicies) || myLeavePolicies.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { myLeavePolicies };
};

const fetchPolicyUsers = async ({ id, schoolId }) => {
  await checkIfPolicyIsActive(id);
  const leavePolicyUsers = await getUsersByPolicyId({ id, schoolId });
  if (!Array.isArray(leavePolicyUsers) || leavePolicyUsers.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { leavePolicyUsers };
};

const updatePolicyUsers = async ({ policyId, users, schoolId }) => {
  await checkIfPolicyIsActive(policyId);
  const affectedRow = await updatePolicyUsersById({
    policyId,
    users,
    schoolId,
  });
  if (affectedRow <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { message: "Users of policy updated" };
};

const deletePolicyUser = async ({ user, id, schoolId }) => {
  await checkIfPolicyIsActive(id);
  const affectedRow = await deleteUserFromPolicyById({ user, id, schoolId });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete user from policy");
  }
  return { message: "User deleted from policy successfully" };
};

const reviewLeavePolicy = async ({ status, policyId, schoolId }) => {
  const affectedRow = await enableDisableLeavePolicy({
    status,
    policyId,
    schoolId,
  });
  if (affectedRow <= 0) {
    const sts = status ? "enable" : "disable";
    throw new ApiError(500, `Unable to ${sts} policy`);
  }
  const responseStatus = status ? "enabled" : "disabled";
  return { message: `Policy ${responseStatus} successfully` };
};

const fetchPolicyEligibleUsers = async (schoolId) => {
  const leavePolicyEligibleUsers = await getPolicyEligibleUsers(schoolId);
  if (
    !Array.isArray(leavePolicyEligibleUsers) ||
    leavePolicyEligibleUsers.length <= 0
  ) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { leavePolicyEligibleUsers };
};

const addNewLeaveRequest = async (payload) => {
  await checkIfPolicyIsActive(payload.policy);

  const affectedRow = await createNewLeaveRequest(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new leave request");
  }
  return { message: "Leave request added successfully" };
};

const updateLeaveRequest = async (payload) => {
  await checkIfPolicyIsActive(payload.policy);
  const affectedRow = await updateLeaveRequestById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update leave request");
  }
  return { message: "Leave request updated successfully" };
};

const getUserLeaveHistory = async ({ id, schoolId }) => {
  const leaveHistory = await getLeaveRequestHistoryByUser({ id, schoolId });
  if (!Array.isArray(leaveHistory) || leaveHistory.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { leaveHistory };
};

const deleteLeaveRequest = async ({ id, schoolId }) => {
  const affectedRow = await deleteLeaveRequestByRequestId({ id, schoolId });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete leave request");
  }
  return { message: "Leave reuquest deleted successfully" };
};

const fetchPendingLeaveRequests = async (schoolId) => {
  const pendingLeaves = await getPendingLeaveRequests(schoolId);
  if (!Array.isArray(pendingLeaves) || pendingLeaves.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { pendingLeaves };
};

const reviewPendingLeaveRequest = async ({
  reviewerUserId,
  requestId,
  status,
  schoolId,
  reviewerRoleId,
}) => {
  const user = await findReviewerIdByRequestId(requestId);
  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const { reporter_id } = user;
  if (reviewerRoleId !== 2 && reporter_id !== reviewerUserId) {
    throw new ApiError(403, "Forbidden. Authorised reviewer only.");
  }

  const affectedRow = await approveOrCancelPendingLeaveRequest({
    reviewerUserId,
    requestId,
    status,
    schoolId,
  });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Operation failed");
  }

  return { message: "Success" };
};

module.exports = {
  makeNewLeavePolicy,
  updateLeavePolicy,
  fetchLeavePolicies,
  fetchPolicyUsers,
  updatePolicyUsers,
  reviewLeavePolicy,
  deletePolicyUser,
  fetchPolicyEligibleUsers,
  addNewLeaveRequest,
  updateLeaveRequest,
  getUserLeaveHistory,
  deleteLeaveRequest,
  fetchPendingLeaveRequests,
  reviewPendingLeaveRequest,
  processGetMyLeavePolicy,
};
