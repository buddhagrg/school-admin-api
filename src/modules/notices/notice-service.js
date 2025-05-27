import { assertRowCount, handleArryResponse } from '../../utils/index.js';
import {
  addNotice,
  updateNotice,
  getNotices,
  getNoticeRecipients,
  deleteNotice,
  reviewNoticeStatus,
  publishNotice
} from './notice-repository.js';
import { NOTICE_MESSAGES } from './notice-messages.js';

export const processGetNoticeRecipients = async (schoolId) => {
  return handleArryResponse(() => getNoticeRecipients(schoolId), 'noticeRecipients');
};

export const processGetNotices = async (userId) => {
  return handleArryResponse(() => getNotices(userId), 'notices');
};

export const processAddNotice = async (payload) => {
  await assertRowCount(addNotice(payload), NOTICE_MESSAGES.ADD_NOTICE_FAIL);
  return { message: NOTICE_MESSAGES.ADD_NOTICE_SUCCESS };
};

export const processUpdateNotice = async (payload) => {
  await assertRowCount(updateNotice(payload), NOTICE_MESSAGES.UPDATE_NOTICE_FAIL);
  return { message: NOTICE_MESSAGES.UPDATE_NOTICE_SUCCESS };
};

export const processReviewNoticeStatus = async (payload) => {
  await assertRowCount(reviewNoticeStatus(payload), NOTICE_MESSAGES.REVIEW_NOTICE_FAIL);
  return { message: NOTICE_MESSAGES.REVIEW_NOTICE_SUCCESS };
};

export const processDeleteNotice = async (payload) => {
  await assertRowCount(deleteNotice(payload), NOTICE_MESSAGES.DELETE_NOTICE_FAIL);
  return { message: NOTICE_MESSAGES.DELETE_NOTICE_SUCCESS };
};

export const processPublishNotice = async (payload) => {
  await assertRowCount(publishNotice(payload), NOTICE_MESSAGES.PUBLISH_NOTICE_FAIL);
  return { message: NOTICE_MESSAGES.PUBLISH_NOTICE_SUCCESS };
};
