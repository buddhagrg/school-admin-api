const express = require("express");
const router = express.Router();
const noticeController = require("./notices-controller");
const { checkRoleAccess } = require("../../middlewares");

router.get("/recipients/list", noticeController.handleFetchNoticeRecipients);
router.get("/recipients", noticeController.handleGetNoticeRecipients);
router.get("/recipients/:id", noticeController.handleGetNoticeRecipient);
router.post("/recipients", noticeController.handleAddNoticeRecipient);
router.put("/recipients/:id", noticeController.handleUpdateNoticeRecipient);
router.delete("/recipients/:id", noticeController.handleDeleteNoticeRecipient);
router.post("/:id/status", noticeController.handleNoticeStatus);
router.get("/:id", noticeController.handleFetchNoticeDetailById);
router.get("", noticeController.handleFetchAllNotices);
router.post("", noticeController.handleAddNotice);
router.put("/:id", noticeController.handleUpdateNotice);

module.exports = { noticesRoutes: router };
