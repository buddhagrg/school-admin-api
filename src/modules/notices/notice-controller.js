const asyncHandler = require("express-async-handler");
const {
  processGetNoticeRecipients,
  processGetNotices,
  processGetNotice,
  processAddNotice,
  processUpdateNotice,
  processNoticeStatus,
  processGetPendingNotices,
} = require("./notice-service");

const handleGetNoticeRecipients = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetNoticeRecipients(schoolId);
  res.json(response);
});

const handleGetNotices = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const response = await processGetNotices(userId);
  res.json(response);
});

const handleGetPendingNotices = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetPendingNotices(schoolId);
  res.json(response);
});

const handleGetNotice = asyncHandler(async (req, res) => {
  const { id: noticeId } = req.params;
  const { schoolId } = req.user;
  const response = await processGetNotice({ noticeId, schoolId });
  res.json(response);
});

const handleAddNotice = asyncHandler(async (req, res) => {
  const { id: authorId, schoolId } = req.user;
  const payload = req.body;
  const response = await processAddNotice({ ...payload, authorId, schoolId });
  res.json(response);
});

const handleUpdateNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateNotice({ ...payload, id, schoolId });
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
  handleGetNoticeRecipients,
  handleGetNotices,
  handleGetNotice,
  handleAddNotice,
  handleUpdateNotice,
  handleNoticeStatus,
  handleGetPendingNotices,
};
