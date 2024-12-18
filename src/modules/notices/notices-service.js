const { ApiError } = require("../../utils");
const {
  getNoticeById,
  addNewNotice,
  updateNoticeById,
  manageNoticeStatus,
  getNotices,
  getNoticeRecipientList,
  getAllPendingNotices,
} = require("./notices-repository");

const fetchNoticeRecipients = async (schoolId) => {
  const recipients = await getNoticeRecipientList(schoolId);
  if (!Array.isArray(recipients) || recipients.length <= 0) {
    throw new ApiError(404, "Recipients not found");
  }
  return recipients;
};

const fetchAllNotices = async (userId) => {
  const notices = await getNotices(userId);
  if (notices.length <= 0) {
    throw new ApiError(404, "Notices not found");
  }
  return notices;
};

const fetchNoticeDetailById = async (payload) => {
  const noticeDetail = await getNoticeById(payload);
  if (!noticeDetail) {
    throw new ApiError(404, "Notice detail not found");
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
    throw new ApiError(404, "Notice not found");
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
  const notices = await getAllPendingNotices(schoolId);
  if (notices.length <= 0) {
    throw new ApiError(404, "Pending Notices not found");
  }

  return notices;
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
