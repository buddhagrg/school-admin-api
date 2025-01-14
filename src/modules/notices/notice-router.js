const express = require("express");
const router = express.Router();
const noticeController = require("./notice-controller");
const { checkApiAccess } = require("../../middlewares");

router.get(
  "/recipients/list",
  checkApiAccess,
  noticeController.handleFetchNoticeRecipients
);
router.post("/:id/status", checkApiAccess, noticeController.handleNoticeStatus);
router.get(
  "/pending",
  checkApiAccess,
  noticeController.handleFetchAllPendingNotices
);
router.get(
  "/:id",
  checkApiAccess,
  noticeController.handleFetchNoticeDetailById
);
router.get("", checkApiAccess, noticeController.handleFetchAllNotices);
router.post("", checkApiAccess, noticeController.handleAddNotice);
router.put("/:id", checkApiAccess, noticeController.handleUpdateNotice);

module.exports = { noticeRoutes: router };
