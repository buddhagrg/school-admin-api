import express from 'express';
import * as noticeController from './notice-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.get('/recipients', checkApiAccess, noticeController.handleGetNoticeRecipients);
router.patch('/:id/review', checkApiAccess, noticeController.handleReviewNoticeStatus);
router.patch('/:id/publish', checkApiAccess, noticeController.handlePublishNotice);
router.get('', checkApiAccess, noticeController.handleGetNotices);
router.post('', checkApiAccess, noticeController.handleAddNotice);
router.put('/:id', checkApiAccess, noticeController.handleUpdateNotice);
router.delete('/:id', checkApiAccess, noticeController.handleDeleteNotice);

export { router as noticeRoutes };
