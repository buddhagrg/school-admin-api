const express = require("express");
const router = express.Router();
const invoiceController = require("./invoice-controller");

router.get("", invoiceController.handleGetAllInvoices);
router.get("/:id", invoiceController.handleGetInvoiceById);
router.post("", invoiceController.handleAddInvoice);
router.put("", invoiceController.handleUpdateInvoice);

router.post("/:id/pay", invoiceController.handlePayInvoice);
router.post("/:id/refund", invoiceController.handleRefundInvoice);
router.post("/:id/dispute", invoiceController.handleDisputeInvoice);
router.post("/:id/cancel", invoiceController.handleCancelInvoice);
// router.post("/:id/discount");
router.post(
  "/:id/dispute/resolve",
  invoiceController.handleResolveDisputeInvoice
);

router.delete("/:id/items/:itemId", invoiceController.handleRemoveInvoiceItem);

module.exports = { invoiceRoutes: router };
