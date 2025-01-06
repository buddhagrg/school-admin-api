const express = require("express");
const router = express.Router();
const depositController = require("./deposit-controller");

router.get("", depositController.handleGetDeposits);
router.post("", depositController.handleAddDeposit);
router.get("/:id", depositController.handleGetDeposit);
router.put("/:id", depositController.handleUpdateDeposit);
router.post("/:id/refund", depositController.handleRefundDeposit);

module.exports = { depositRoutes: router };
