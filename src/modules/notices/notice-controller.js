import asyncHandler from 'express-async-handler';
import {
  processGetNoticeRecipients,
  processGetNotices,
  processAddNotice,
  processUpdateNotice,
  processDeleteNotice,
  processReviewNoticeStatus,
  processPublishNotice
} from './notice-service.js';

export const handleGetNoticeRecipients = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetNoticeRecipients(schoolId);
  res.json(response);
});

export const handleGetNotices = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { statusId, roleId, fromDate, toDate } = req.query;
  const response = await processGetNotices({
    userId,
    statusId,
    roleId,
    fromDate,
    toDate
  });
  res.json(response);
});

export const handleAddNotice = asyncHandler(async (req, res) => {
  const { id: authorId, schoolId } = req.user;
  const payload = req.body;
  const response = await processAddNotice({ ...payload, authorId, schoolId });
  res.json(response);
});

export const handleUpdateNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateNotice({ ...payload, id, schoolId });
  res.json(response);
});

export const handleReviewNoticeStatus = asyncHandler(async (req, res) => {
  const { id: reviewerId, schoolId } = req.user;
  const { id } = req.params;
  const { status } = req.body;
  const payload = {
    id,
    status,
    reviewerId,
    schoolId
  };
  const response = await processReviewNoticeStatus(payload);
  res.json(response);
});

export const handleDeleteNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processDeleteNotice({ id, schoolId });
  res.json(response);
});

export const handlePublishNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processPublishNotice({ id, schoolId });
  res.json(response);
});
