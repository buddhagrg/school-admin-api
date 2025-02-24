const express = require("express");
const router = express.Router();
const noticeController = require("./notice-controller");
const { checkApiAccess } = require("../../middlewares");

router.get(
  "/recipients",
  checkApiAccess,
  noticeController.handleGetNoticeRecipients
);
router.patch("/:id/status", checkApiAccess, noticeController.handleNoticeStatus);
router.get(
  "/pending",
  checkApiAccess,
  noticeController.handleGetPendingNotices
);
router.get(
  "/:id",
  checkApiAccess,
  noticeController.handleGetNotice
);
router.get("", checkApiAccess, noticeController.handleGetNotices);
router.post("", checkApiAccess, noticeController.handleAddNotice);
router.put("/:id", checkApiAccess, noticeController.handleUpdateNotice);

module.exports = { noticeRoutes: router };
