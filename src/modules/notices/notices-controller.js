const asyncHandler = require("express-async-handler");
const { fetchNoticeRecipients, fetchAllNotices, fetchNoticeDetailById, addNotice, updateNotice, processNoticeStatus } = require("./notices-service");

const handleFetchNoticeRecipients = asyncHandler(async (req, res) => {
    const noticeRecipients = await fetchNoticeRecipients();
    res.json({ noticeRecipients });
});

const handleFetchAllNotices = asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const notices = await fetchAllNotices(userId);
    res.json({ notices });
});

const handleFetchNoticeDetailById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notice = await fetchNoticeDetailById(id);
    res.json(notice);
});

const handleAddNotice = asyncHandler(async (req, res) => {
    const { id: authorId } = req.user;
    const payload = req.body;
    const message = await addNotice({ ...payload, authorId });
    res.json(message);
});

const handleUpdateNotice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const message = await updateNotice({ ...payload, id });
    res.json(message);
});

const handleNoticeStatus = asyncHandler(async (req, res) => {
    const { id: currentUserId, role: currentUserRole } = req.user;
    const { id: noticeId } = req.params;
    const { status } = req.body;
    const payload = { noticeId, status, currentUserId, currentUserRole };
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
};