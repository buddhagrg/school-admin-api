const { ApiError } = require("../../utils");
const { getNoticeRecipients, getNoticeById, addNewNotice, updateNoticeById, manageNoticeStatus, getNotices } = require("./notices-repository")

const fetchNoticeRecipients = async () => {
    const recipients = await getNoticeRecipients();
    if (!Array.isArray(recipients) || recipients.length <= 0) {
        throw new ApiError(404, "Recipients not found");
    }
    return recipients;
}

const fetchAllNotices = async (userId) => {
    const notices = await getNotices(userId);
    if (notices.length <= 0) {
        throw new ApiError(404, "Notices not found");
    }
    return notices;
}

const fetchNoticeDetailById = async (id) => {
    const noticeDetail = await getNoticeById(id);
    if (!noticeDetail) {
        throw new ApiError(404, "Notice detail not found");
    }
    return noticeDetail;
}

const addNotice = async (payload) => {
    const affectedRow = await addNewNotice(payload);
    if (affectedRow <= 0) {
        throw new ApiError(500, "Unable to add new notice");
    }

    return { message: "Notice added successfully" };
}

const updateNotice = async (payload) => {
    const affectedRow = await updateNoticeById(payload);
    if (affectedRow <= 0) {
        throw new ApiError(500, "Unable to update notice");
    }

    return { message: "Notice updated successfully" };
}

const processNoticeStatus = async (payload) => {
    const { noticeId, status, currentUserId, currentUserRole } = payload;
    const notice = await getNoticeById(noticeId);
    if (!notice) {
        throw new ApiError(404, "Notice not found");
    }

    const now = new Date();
    const { authorId, reviewer_id: reviewerIdFromDB, reviewed_dt: reviewedDateFromDB } = notice;
    const userCanManageStatus = handleStatusCheck(currentUserRole, currentUserId, authorId, status);
    if (!userCanManageStatus) {
        throw new ApiError(403, "Forbidden. You do not have permission to access to this resource.");
    }

    const affectedRow = await manageNoticeStatus({
        noticeId,
        status,
        reviewerId: currentUserRole === 'admin' ? currentUserId : reviewerIdFromDB,
        reviewDate: currentUserRole === 'admin' ? now : reviewedDateFromDB
    });
    if (affectedRow <= 0) {
        throw new ApiError(500, "Unable to review notice");
    }

    return { message: "Success" };
}

const handleStatusCheck = (currentUserRole, currentUserId, authorId, status) => {
    if (currentUserRole === 'admin') {
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
}

module.exports = {
    fetchNoticeRecipients,
    fetchAllNotices,
    fetchNoticeDetailById,
    addNotice,
    updateNotice,
    processNoticeStatus,
};