const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  addNewLeavePolicy,
  updateLeavePolicy,
  getLeavePolicies,
  getPolicyUsers,
  linkPolicyUsers,
  updateLeavePolicyStatus,
  unlinkPolicyUser,
  getPolicyEligibleUsers,
  addNewLeaveRequest,
  updateLeaveRequest,
  getUserLeaveHistory,
  deleteLeaveRequest,
  getPendingLeaveRequests,
  updatePendingLeaveRequestStatus,
  findLeaveRequestReviewer,
  getMyLeavePolicy,
} = require("./leave-repository");

const processAddNewLeavePolicy = async (payload) => {
  const affectedRow = await addNewLeavePolicy(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add leave policy");
  }
  return { message: "Leave policy added successfully" };
};

const processUpdateLeavePolicy = async (payload) => {
  const affectedRow = await updateLeavePolicy(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update policy");
  }
  return { message: "Policy updated successfully" };
};

const processGetLeavePolicies = async (schoolId) => {
  const leavePolicies = await getLeavePolicies(schoolId);
  if (!Array.isArray(leavePolicies) || leavePolicies.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { leavePolicies };
};

const processGetMyLeavePolicy = async (payload) => {
  const myLeavePolicies = await getMyLeavePolicy(payload);
  if (!Array.isArray(myLeavePolicies) || myLeavePolicies.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { myLeavePolicies };
};

const processGetPolicyUsers = async (payload) => {
  const leavePolicyUsers = await getPolicyUsers(payload);
  if (!Array.isArray(leavePolicyUsers) || leavePolicyUsers.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { leavePolicyUsers };
};

const processLinkPolicyUsers = async (payload) => {
  const affectedRow = await linkPolicyUsers(payload);
  if (affectedRow <= 0) {
    throw new ApiError(404, "Unable to add users to policy");
  }
  return { message: "Users added to policy successfully" };
};

const processUnlinkPolicyUser = async (payload) => {
  const affectedRow = await unlinkPolicyUser(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete user from policy");
  }
  return { message: "User deleted from policy successfully" };
};

const processUpdateLeavePolicyStatus = async (payload) => {
  const affectedRow = await updateLeavePolicyStatus(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, `Unable to update policy status`);
  }
  return { message: `Policy status updated successfully` };
};

const processGetPolicyEligibleUsers = async (schoolId) => {
  const leavePolicyEligibleUsers = await getPolicyEligibleUsers(schoolId);
  if (
    !Array.isArray(leavePolicyEligibleUsers) ||
    leavePolicyEligibleUsers.length <= 0
  ) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { leavePolicyEligibleUsers };
};

const processAddNewLeaveRequest = async (payload) => {
  const affectedRow = await addNewLeaveRequest(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new leave request");
  }
  return { message: "Leave request added successfully" };
};

const processUpdateLeaveRequest = async (payload) => {
  const affectedRow = await updateLeaveRequest(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update leave request");
  }
  return { message: "Leave request updated successfully" };
};

const processGetUserLeaveHistory = async (payload) => {
  const leaveHistory = await getUserLeaveHistory(payload);
  if (!Array.isArray(leaveHistory) || leaveHistory.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { leaveHistory };
};

const processDeleteLeaveRequest = async (payload) => {
  const affectedRow = await deleteLeaveRequest(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete leave request");
  }
  return { message: "Leave reuquest deleted successfully" };
};

const processGetPendingLeaveRequests = async (schoolId) => {
  const pendingLeaves = await getPendingLeaveRequests(schoolId);
  if (!Array.isArray(pendingLeaves) || pendingLeaves.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { pendingLeaves };
};

const processUpdatePendingLeaveRequestStatus = async ({
  reviewerUserId,
  requestId,
  status,
  schoolId,
  reviewerRoleId,
}) => {
  const user = await findLeaveRequestReviewer(requestId);
  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const { reporter_id } = user;
  if (reviewerRoleId !== 2 && reporter_id !== reviewerUserId) {
    throw new ApiError(403, "Forbidden. Authorised reviewer only.");
  }

  const affectedRow = await updatePendingLeaveRequestStatus({
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
  processAddNewLeavePolicy,
  processUpdateLeavePolicy,
  processGetLeavePolicies,
  processGetPolicyUsers,
  processLinkPolicyUsers,
  processUpdateLeavePolicyStatus,
  processUnlinkPolicyUser,
  processGetPolicyEligibleUsers,
  processAddNewLeaveRequest,
  processUpdateLeaveRequest,
  processGetUserLeaveHistory,
  processDeleteLeaveRequest,
  processGetPendingLeaveRequests,
  processUpdatePendingLeaveRequestStatus,
  processGetMyLeavePolicy,
};
