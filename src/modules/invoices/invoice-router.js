const express = require("express");
const router = express.Router();
const invoiceController = require("./invoice-controller");
const { checkApiAccess } = require("../../middlewares");

router.get("", checkApiAccess, invoiceController.handleGetAllInvoices);
router.get("/:id", checkApiAccess, invoiceController.handleGetInvoiceById);
router.post("", checkApiAccess, invoiceController.handleGenerateInvoice);

router.post("/:id/pay", checkApiAccess, invoiceController.handlePayInvoice);
router.post(
  "/:id/refund",
  checkApiAccess,
  invoiceController.handleRefundInvoice
);
router.post(
  "/:id/dispute",
  checkApiAccess,
  invoiceController.handleDisputeInvoice
);
router.post(
  "/:id/cancel",
  checkApiAccess,
  invoiceController.handleCancelInvoice
);
// router.post("/:id/discount");
router.post(
  "/:id/dispute/resolve",
  checkApiAccess,
  invoiceController.handleResolveDisputeInvoice
);

router.delete(
  "/:id/items/:itemId",
  checkApiAccess,
  invoiceController.handleRemoveInvoiceItem
);

module.exports = { invoiceRoutes: router };
