const asyncHandler = require("express-async-handler");
const {
  fetchNoticeRecipients,
  fetchAllNotices,
  fetchNoticeDetailById,
  addNotice,
  updateNotice,
  processNoticeStatus,
  processGetAllPendingNotices,
} = require("./notice-service");

const handleFetchNoticeRecipients = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await fetchNoticeRecipients(schoolId);
  res.json(response);
});

const handleFetchAllNotices = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const response = await fetchAllNotices(userId);
  res.json(response);
});

const handleFetchAllPendingNotices = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllPendingNotices(schoolId);
  res.json(response);
});

const handleFetchNoticeDetailById = asyncHandler(async (req, res) => {
  const { id: noticeId } = req.params;
  const { schoolId } = req.user;
  const response = await fetchNoticeDetailById({ noticeId, schoolId });
  res.json(response);
});

const handleAddNotice = asyncHandler(async (req, res) => {
  const { id: authorId, schoolId } = req.user;
  const payload = req.body;
  const response = await addNotice({ ...payload, authorId, schoolId });
  res.json(response);
});

const handleUpdateNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await updateNotice({ ...payload, id, schoolId });
  res.json(response);
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
  const response = await processNoticeStatus(payload);
  res.json(response);
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
