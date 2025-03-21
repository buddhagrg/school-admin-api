const { db } = require("../../config");
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
  getUserWithLeavePolicies,
  insertUserLeave,
  insertUserAttendance,
  deleteAttendanceRecord,
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
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { leavePolicies };
};

const processGetMyLeavePolicy = async (payload) => {
  const leavePolicies = await getMyLeavePolicy(payload);
  if (!Array.isArray(leavePolicies) || leavePolicies.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { leavePolicies };
};

const processGetPolicyUsers = async (payload) => {
  const users = await getPolicyUsers(payload);
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { users };
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
  const users = await getPolicyEligibleUsers(schoolId);
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { users };
};

const processAddNewLeaveRequest = async (payload) => {
  const affectedRow = await addNewLeaveRequest(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new leave request");
  }
  return { message: "Leave request added successfully" };
};

const processUpdateLeaveRequest = async (payload) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await deleteAttendanceRecord({
      payload: {
        id: payload.id,
        schoolId: payload.schoolId,
      },
      client,
    });

    const affectedRow = await updateLeaveRequest(payload);
    if (affectedRow <= 0) {
      throw new ApiError(500, "Unable to update leave request");
    }

    await client.query("COMMIT");
    return { message: "Leave request updated successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const processGetUserLeaveHistory = async (payload) => {
  const leaveHistory = await getUserLeaveHistory(payload);
  if (!Array.isArray(leaveHistory) || leaveHistory.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { leaveHistory };
};

const processDeleteLeaveRequest = async (payload) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    await deleteAttendanceRecord({
      payload,
      client,
    });

    const leaveDeleteCount = await deleteLeaveRequest({ payload, client });
    if (leaveDeleteCount <= 0) {
      throw new ApiError(500, "Unable to delete leave data");
    }

    await client.query("COMMIT");
    return { message: "Leave deleted successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const processGetPendingLeaveRequests = async (schoolId) => {
  const pendingLeaves = await getPendingLeaveRequests(schoolId);
  if (!Array.isArray(pendingLeaves) || pendingLeaves.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
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

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const data = await updatePendingLeaveRequestStatus({
      payload: {
        reviewerUserId,
        requestId,
        status,
        schoolId,
      },
      client,
    });
    if (!data) {
      throw new ApiError(500, "Unable to update leave status");
    }

    if (status === "APPROVED") {
      const attendancePayload = {
        note: data.note,
        userId: data.user_id,
        schoolId,
        approverId: reviewerUserId,
        userLeaveId: requestId,
        from: data.from_date,
        to: data.to_date,
      };
      await insertUserAttendance({ payload: attendancePayload, client });
    }

    await client.query("COMMIT");
    return { message: "Success" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const processGetUserWithLeavePolicies = async (payload) => {
  const result = await getUserWithLeavePolicies(payload);
  if (
    !result ||
    Object.keys(result.user).length === 0 ||
    result.leavePolicies.length === 0
  ) {
    throw new ApiError(
      404,
      `${ERROR_MESSAGES.DATA_NOT_FOUND} for user id: ${payload.userId}`
    );
  }
  return result;
};

const processApplyUserLeaveRequest = async (payload) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const userLeaveId = await insertUserLeave({ payload, client });
    await insertUserAttendance({
      payload: { ...payload, userLeaveId },
      client,
    });
    await client.query("COMMIT");
    return { message: "Leave request applied for user successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new ApiError(500, "Unable to apply leave request for user");
  } finally {
    client.release();
  }
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
  processGetUserWithLeavePolicies,
  processApplyUserLeaveRequest,
};
