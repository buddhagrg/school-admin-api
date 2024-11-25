const asyncHandler = require("express-async-handler");
const {
  fetchNoticeRecipients,
  fetchAllNotices,
  fetchNoticeDetailById,
  addNotice,
  updateNotice,
  processNoticeStatus,
  processGetAllPendingNotices,
} = require("./notices-service");

const handleFetchNoticeRecipients = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const noticeRecipients = await fetchNoticeRecipients(schoolId);
  res.json({ noticeRecipients });
});

const handleFetchAllNotices = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const notices = await fetchAllNotices(userId);
  res.json({ notices });
});

const handleFetchAllPendingNotices = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const notices = await processGetAllPendingNotices(schoolId);
  res.json({ notices });
});

const handleFetchNoticeDetailById = asyncHandler(async (req, res) => {
  const { id: noticeId } = req.params;
  const { schoolId } = req.user;
  const notice = await fetchNoticeDetailById({ noticeId, schoolId });
  res.json(notice);
});

const handleAddNotice = asyncHandler(async (req, res) => {
  const { id: authorId, schoolId } = req.user;
  const payload = req.body;
  const message = await addNotice({ ...payload, authorId, schoolId });
  res.json(message);
});

const handleUpdateNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const message = await updateNotice({ ...payload, id, schoolId });
  res.json(message);
});

const handleNoticeStatus = asyncHandler(async (req, res) => {
  const {
    id: currentUserId,
    staticRoleId: currentUserRoleId,
    schoolId,
  } = req.user;
  const { id: noticeId } = req.params;
  const { status } = req.body;
  const payload = {
    noticeId,
    status,
    currentUserId,
    currentUserRoleId,
    schoolId,
  };
  const message = await processNoticeStatus(payload);
  res.json(message);
});

module.exports = {
  handleFetchNoticeRecipients,
  handleFetchAllNotices,
  handleFetchNoticeDetailById,
  handleAddNotice,
  handleUpdateNotice,
  handleNoticeStatus,
  handleFetchAllPendingNotices,
};
