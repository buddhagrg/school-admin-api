const express = require("express");
const router = express.Router();
const paymentController = require("./payment-controller");
const { checkApiAccess } = require("../../middlewares");

router.post(
  "/general/pay",
  checkApiAccess,
  paymentController.handleDoGeneralPayment
);

router.get(
  "/methods",
  checkApiAccess,
  paymentController.handleGetAllPaymentMethods
);
router.post(
  "/methods",
  checkApiAccess,
  paymentController.handleAddPaymentMethod
);
router.put(
  "/methods/:id",
  checkApiAccess,
  paymentController.handleUpdatePaymentMethod
);
router.delete(
  "/methods/:id",
  checkApiAccess,
  paymentController.handleDeactivatePaymentMethod
);

module.exports = { paymentRoutes: router };
