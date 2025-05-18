import { db } from '../../config/index.js';
import { ERROR_MESSAGES, DB_TXN } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
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
  getMyLeavePolicy,
  getUserWithLeavePolicies,
  insertUserLeave,
  insertUserAttendance,
  deleteAttendanceRecord
} from './leave-repository.js';

export const processAddNewLeavePolicy = async (payload) => {
  const affectedRow = await addNewLeavePolicy(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add leave policy');
  }
  return { message: 'Leave policy added successfully' };
};

export const processUpdateLeavePolicy = async (payload) => {
  const affectedRow = await updateLeavePolicy(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update policy');
  }
  return { message: 'Policy updated successfully' };
};

export const processGetLeavePolicies = async (schoolId) => {
  const leavePolicies = await getLeavePolicies(schoolId);
  if (!Array.isArray(leavePolicies) || leavePolicies.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { leavePolicies };
};

export const processGetMyLeavePolicy = async (payload) => {
  const leavePolicies = await getMyLeavePolicy(payload);
  if (!Array.isArray(leavePolicies) || leavePolicies.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { leavePolicies };
};

export const processGetPolicyUsers = async (payload) => {
  const users = await getPolicyUsers(payload);
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { users };
};

export const processLinkPolicyUsers = async (payload) => {
  const affectedRow = await linkPolicyUsers(payload);
  if (affectedRow <= 0) {
    throw new ApiError(404, 'Unable to add users to policy');
  }
  return { message: 'Users added to policy successfully' };
};

export const processUnlinkPolicyUser = async (payload) => {
  const affectedRow = await unlinkPolicyUser(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to delete user from policy');
  }
  return { message: 'User deleted from policy successfully' };
};

export const processUpdateLeavePolicyStatus = async (payload) => {
  const affectedRow = await updateLeavePolicyStatus(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, `Unable to update policy status`);
  }
  return { message: `Policy status updated successfully` };
};

export const processGetPolicyEligibleUsers = async (schoolId) => {
  const users = await getPolicyEligibleUsers(schoolId);
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { users };
};

export const processAddNewLeaveRequest = async (payload) => {
  const affectedRow = await addNewLeaveRequest(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add new leave request');
  }
  return { message: 'Leave request added successfully' };
};

export const processUpdateLeaveRequest = async (payload) => {
  const affectedRow = await updateLeaveRequest(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update leave request');
  }
  return { message: 'Leave request updated successfully' };
};

export const processGetUserLeaveHistory = async (payload) => {
  const leaveHistory = await getUserLeaveHistory(payload);
  if (!Array.isArray(leaveHistory) || leaveHistory.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { leaveHistory };
};

export const processDeleteLeaveRequest = async (payload) => {
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    await deleteAttendanceRecord({
      payload,
      client
    });
    const leaveDeleteCount = await deleteLeaveRequest({ payload, client });
    if (leaveDeleteCount <= 0) {
      throw new ApiError(500, 'Unable to delete leave data');
    }
    await client.query(DB_TXN.COMMIT);
    return { message: 'Leave deleted successfully' };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    throw error;
  } finally {
    client.release();
  }
};

export const processGetPendingLeaveRequests = async (schoolId) => {
  const pendingLeaves = await getPendingLeaveRequests(schoolId);
  if (!Array.isArray(pendingLeaves) || pendingLeaves.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { pendingLeaves };
};

export const processUpdateLeaveStatus = async (payload) => {
  const { reviewerUserId, requestId, status, schoolId, rejectionReason } = payload;
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const data = await updatePendingLeaveRequestStatus({
      payload: {
        reviewerUserId,
        requestId,
        status,
        schoolId,
        rejectionReason
      },
      client
    });
    if (!data) {
      throw new ApiError(500, 'Unable to update leave status');
    }
    if (status === 'APPROVED') {
      const attendancePayload = {
        note: data.note,
        userId: data.user_id,
        schoolId,
        reviewerId: reviewerUserId,
        userLeaveId: requestId,
        from: data.from_date,
        to: data.to_date
      };
      await insertUserAttendance({ payload: attendancePayload, client });
    }
    await client.query(DB_TXN.COMMIT);
    return { message: 'Success' };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    throw error;
  } finally {
    client.release();
  }
};

export const processGetUserWithLeavePolicies = async (payload) => {
  const result = await getUserWithLeavePolicies(payload);
  if (!result || Object.keys(result.user).length === 0 || result.leavePolicies.length === 0) {
    throw new ApiError(404, `${ERROR_MESSAGES.DATA_NOT_FOUND} for user id: ${payload.userId}`);
  }
  return result;
};

export const processApplyUserLeaveRequest = async (payload) => {
  const client = await db.connect();
  try {
    await client.query(DB_TXN.BEGIN);
    const userLeaveId = await insertUserLeave({ payload, client });
    await insertUserAttendance({
      payload: { ...payload, userLeaveId },
      client
    });
    await client.query(DB_TXN.COMMIT);
    return { message: 'Leave request applied for user successfully' };
  } catch (error) {
    await client.query(DB_TXN.ROLLBACK);
    throw new ApiError(500, 'Unable to apply leave request for user');
  } finally {
    client.release();
  }
};
