const express = require("express");
const router = express.Router();
const depositController = require("./deposit-controller");
const { checkApiAccess } = require("../../middlewares");

router.get("", checkApiAccess, depositController.handleGetDeposits);
router.post("", checkApiAccess, depositController.handleAddDeposit);
router.get("/:id", checkApiAccess, depositController.handleGetDeposit);
router.put("/:id", checkApiAccess, depositController.handleUpdateDeposit);
router.post(
  "/:id/refund",
  checkApiAccess,
  depositController.handleRefundDeposit
);

module.exports = { depositRoutes: router };
