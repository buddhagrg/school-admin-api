const express = require("express");
const router = express.Router();
const noticeController = require("./notices-controller");
const { checkRoleAccess } = require("../../middlewares");

router.get("/recipients", noticeController.handleFetchNoticeRecipients);
router.post("/:id/status", noticeController.handleNoticeStatus);
router.get("/:id", noticeController.handleFetchNoticeDetailById);
router.get("", noticeController.handleFetchAllNotices);
router.post("", noticeController.handleAddNotice);
router.put("/:id", noticeController.handleUpdateNotice);

module.exports = { noticesRoutes: router };
