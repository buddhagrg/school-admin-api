const express = require("express");
const router = express.Router();
const paymentController = require("./payment-controller");

router.post("/general/pay", paymentController.handleDoGeneralPayment);

router.get("/methods", paymentController.handleGetAllPaymentMethods);
router.post("/methods", paymentController.handleAddPaymentMethod);
router.put("/methods/:id", paymentController.handleUpdatePaymentMethod);
router.delete("/methods/:id", paymentController.handleDeactivatePaymentMethod);

module.exports = { paymentRoutes: router };
