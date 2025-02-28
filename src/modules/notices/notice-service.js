const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getNotice,
  addNotice,
  updateNotice,
  updateNoticeStatus,
  getNotices,
  getNoticeRecipients,
  getPendingNotices,
} = require("./notice-repository");

const processGetNoticeRecipients = async (schoolId) => {
  const noticeRecipients = await getNoticeRecipients(schoolId);
  if (!Array.isArray(noticeRecipients) || noticeRecipients.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { noticeRecipients };
};

const processGetNotices = async (userId) => {
  const notices = await getNotices(userId);
  if (notices.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { notices };
};

const processGetNotice = async (payload) => {
  const noticeDetail = await getNotice(payload);
  if (!noticeDetail) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return noticeDetail;
};

const processAddNotice = async (payload) => {
  const affectedRow = await addNotice(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new notice");
  }
  return { message: "Notice added successfully" };
};

const processUpdateNotice = async (payload) => {
  const affectedRow = await updateNotice(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update notice");
  }
  return { message: "Notice updated successfully" };
};

const processNoticeStatus = async (payload) => {
  const { noticeId, status, currentUserId, currentUserRoleId, schoolId } =
    payload;
  const notice = await getNotice({ noticeId, schoolId });
  if (!notice) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }

  const { authorId } = notice;
  const userCanManageStatus = checkStatus(
    currentUserRoleId,
    currentUserId,
    authorId,
    status
  );
  if (!userCanManageStatus) {
    throw new ApiError(
      403,
      "Forbidden. You do not have permission to access to this resource."
    );
  }

  const affectedRow = await updateNoticeStatus({
    noticeId,
    status,
    currentUserId,
  });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to review notice");
  }
  return { message: "Success" };
};

const checkStatus = (
  currentUserRoleId,
  currentUserId,
  authorId,
  status
) => {
  if (currentUserRoleId === 2) {
    return true;
  } else if (authorId === currentUserId) {
    switch (status) {
      case 1:
      case 2:
      case 3:
        return true;
      default:
        return false;
    }
  }
  return false;
};

const processGetPendingNotices = async (schoolId) => {
  const notices = await getPendingNotices(schoolId);
  if (notices.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { notices };
};

module.exports = {
  processGetNoticeRecipients,
  processGetNotices,
  processGetNotice,
  processAddNotice,
  processUpdateNotice,
  processNoticeStatus,
  processGetPendingNotices,
};
