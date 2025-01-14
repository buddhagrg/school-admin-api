const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getNoticeById,
  addNewNotice,
  updateNoticeById,
  manageNoticeStatus,
  getNotices,
  getNoticeRecipientList,
  getAllPendingNotices,
} = require("./notice-repository");

const fetchNoticeRecipients = async (schoolId) => {
  const noticeRecipients = await getNoticeRecipientList(schoolId);
  if (!Array.isArray(noticeRecipients) || noticeRecipients.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { noticeRecipients };
};

const fetchAllNotices = async (userId) => {
  const notices = await getNotices(userId);
  if (notices.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { notices };
};

const fetchNoticeDetailById = async (payload) => {
  const noticeDetail = await getNoticeById(payload);
  if (!noticeDetail) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return noticeDetail;
};

const addNotice = async (payload) => {
  const affectedRow = await addNewNotice(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new notice");
  }
  return { message: "Notice added successfully" };
};

const updateNotice = async (payload) => {
  const affectedRow = await updateNoticeById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update notice");
  }
  return { message: "Notice updated successfully" };
};

const processNoticeStatus = async (payload) => {
  const { noticeId, status, currentUserId, currentUserRoleId, schoolId } =
    payload;
  const notice = await getNoticeById({ noticeId, schoolId });
  if (!notice) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  const { authorId } = notice;
  const userCanManageStatus = handleStatusCheck(
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

  const affectedRow = await manageNoticeStatus({
    noticeId,
    status,
    currentUserId,
  });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to review notice");
  }
  return { message: "Success" };
};

const handleStatusCheck = (
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

const processGetAllPendingNotices = async (schoolId) => {
  const pendingNotices = await getAllPendingNotices(schoolId);
  if (pendingNotices.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { pendingNotices };
};

module.exports = {
  fetchNoticeRecipients,
  fetchAllNotices,
  fetchNoticeDetailById,
  addNotice,
  updateNotice,
  processNoticeStatus,
  processGetAllPendingNotices,
};
