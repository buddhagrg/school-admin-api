import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  addNotice,
  updateNotice,
  getNotices,
  getNoticeRecipients,
  deleteNotice,
  reviewNoticeStatus,
  publishNotice
} from './notice-repository.js';

export const processGetNoticeRecipients = async (schoolId) => {
  const noticeRecipients = await getNoticeRecipients(schoolId);
  if (!Array.isArray(noticeRecipients) || noticeRecipients.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { noticeRecipients };
};

export const processGetNotices = async (userId) => {
  const notices = await getNotices(userId);
  if (notices.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { notices };
};

export const processAddNotice = async (payload) => {
  const affectedRow = await addNotice(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add new notice');
  }
  return { message: 'Notice added successfully' };
};

export const processUpdateNotice = async (payload) => {
  const affectedRow = await updateNotice(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update notice');
  }
  return { message: 'Notice updated successfully' };
};

export const processReviewNoticeStatus = async (payload) => {
  const affectedRow = await reviewNoticeStatus(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to review notice status');
  }
  return { message: 'Notice status reviewed successfully' };
};

export const processDeleteNotice = async (payload) => {
  const affectedRow = await deleteNotice(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to delete notice');
  }
  return { message: 'Notice deleted successfully' };
};

export const processPublishNotice = async (payload) => {
  const affectedRow = await publishNotice(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to publish notice');
  }
  return { message: 'Notice published successfully' };
};
