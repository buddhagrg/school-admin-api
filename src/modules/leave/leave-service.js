import {
  ApiError,
  assertRowCount,
  handleArryResponse,
  handleObjectResponse,
  withTransaction
} from '../../utils/index.js';
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
import { LEAVE_MESSAGES } from './leave-messages.js';

export const processGetLeavePolicies = async (schoolId) => {
  return handleArryResponse(() => getLeavePolicies(schoolId), 'leavePolicies');
};

export const processGetMyLeavePolicy = async (payload) => {
  return handleArryResponse(() => getMyLeavePolicy(payload), 'leavePolicies');
};

export const processGetPolicyUsers = async (payload) => {
  return handleArryResponse(() => getPolicyUsers(payload), 'users');
};

export const processGetPolicyEligibleUsers = async (schoolId) => {
  return handleArryResponse(() => getPolicyEligibleUsers(schoolId), 'users');
};

export const processGetUserLeaveHistory = async (payload) => {
  return handleArryResponse(() => getUserLeaveHistory(payload), 'leaveHistory');
};

export const processAddNewLeavePolicy = async (payload) => {
  await assertRowCount(addNewLeavePolicy(payload), LEAVE_MESSAGES.ADD_NEW_LEAVE_POLICY_FAIL);
  return { message: LEAVE_MESSAGES.ADD_NEW_LEAVE_POLICY_SUCCESS };
};

export const processDeleteLeaveRequest = async (payload) => {
  return withTransaction(async (client) => {
    await assertRowCount(
      await deleteAttendanceRecord(payload, client),
      LEAVE_MESSAGES.LEAVE_DELETE_FAIL
    );

    await assertRowCount(
      await deleteLeaveRequest(payload, client),
      LEAVE_MESSAGES.LEAVE_DELETE_FAIL
    );

    return { message: LEAVE_MESSAGES.LEAVE_DELETE_SUCCESS };
  }, LEAVE_MESSAGES.LEAVE_DELETE_FAIL);
};

export const processGetPendingLeaveRequests = async (schoolId) => {
  return handleArryResponse(() => getPendingLeaveRequests(schoolId), 'pendingLeaves');
};

export const processUpdateLeaveStatus = async (payload) => {
  const { reviewerUserId, requestId, status, schoolId, rejectionReason } = payload;

  return withTransaction(async (client) => {
    const data = await updatePendingLeaveRequestStatus(
      { reviewerUserId, requestId, status, schoolId, rejectionReason },
      client
    );

    if (!data) {
      throw new ApiError(500, LEAVE_MESSAGES.LEAVE_STATUS_UPDATE_FAIL);
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

      await assertRowCount(
        insertUserAttendance(attendancePayload, client),
        LEAVE_MESSAGES.SAVE_ATTENDANCE_FAIL
      );
    }

    return { message: LEAVE_MESSAGES.LEAVE_STATUS_UPDATE_SUCCESS };
  }, LEAVE_MESSAGES.LEAVE_STATUS_UPDATE_FAIL);
};

export const processGetUserWithLeavePolicies = async (payload) => {
  return handleObjectResponse(() => getUserWithLeavePolicies(payload));
};

export const processApplyUserLeaveRequest = async (payload) => {
  return withTransaction(async (client) => {
    const userLeaveId = await insertUserLeave(payload, client);

    await assertRowCount(
      insertUserAttendance({ ...payload, userLeaveId }, client),
      LEAVE_MESSAGES.APPLY_LEAVE_REQUEST_FAIL
    );

    return { message: LEAVE_MESSAGES.APPLY_LEAVE_REQUEST_SUCCESS };
  }, LEAVE_MESSAGES.APPLY_LEAVE_REQUEST_FAIL);
};

export const processUpdateLeavePolicy = async (payload) => {
  await assertRowCount(updateLeavePolicy(payload), LEAVE_MESSAGES.UPDATE_POLICY_STATUS_FAIL);
  return { message: LEAVE_MESSAGES.UPDATE_POLICY_STATUS_SUCCESS };
};

export const processLinkPolicyUsers = async (payload) => {
  await assertRowCount(linkPolicyUsers(payload), LEAVE_MESSAGES.LINK_POLICY_USERS_FAIL);
  return { message: LEAVE_MESSAGES.LINK_POLICY_USERS_SUCCESS };
};

export const processUnlinkPolicyUser = async (payload) => {
  await assertRowCount(unlinkPolicyUser(payload), LEAVE_MESSAGES.UNLINK_POLICY_USER_FAIL);
  return { message: LEAVE_MESSAGES.UNLINK_POLICY_USER_SUCCESS };
};

export const processUpdateLeavePolicyStatus = async (payload) => {
  await assertRowCount(updateLeavePolicyStatus(payload), LEAVE_MESSAGES.UPDATE_POLICY_STATUS_FAIL);
  return { message: LEAVE_MESSAGES.UPDATE_POLICY_STATUS_SUCCESS };
};

export const processAddNewLeaveRequest = async (payload) => {
  await assertRowCount(addNewLeaveRequest(payload), LEAVE_MESSAGES.ADD_LEAVE_REQUEST_FAIL);
  return { message: LEAVE_MESSAGES.ADD_LEAVE_REQUEST_SUCCESS };
};

export const processUpdateLeaveRequest = async (payload) => {
  await assertRowCount(updateLeaveRequest(payload), LEAVE_MESSAGES.UPDATE_LEAVE_REQUEST_FAIL);
  return { message: LEAVE_MESSAGES.UPDATE_LEAVE_REQUEST_SUCCESS };
};
