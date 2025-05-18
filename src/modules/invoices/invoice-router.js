import express from 'express';
import * as invoiceController from './invoice-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.get('', checkApiAccess, invoiceController.handleGetAllInvoices);
router.get('/:id', checkApiAccess, invoiceController.handleGetInvoiceById);
router.post('', checkApiAccess, invoiceController.handleGenerateInvoice);
router.post('/:id/pay', checkApiAccess, invoiceController.handlePayInvoice);
router.post('/:id/refund', checkApiAccess, invoiceController.handleRefundInvoice);
router.post('/:id/dispute', checkApiAccess, invoiceController.handleDisputeInvoice);
router.post('/:id/cancel', checkApiAccess, invoiceController.handleCancelInvoice);
// router.post("/:id/discount");
router.post('/:id/dispute/resolve', checkApiAccess, invoiceController.handleResolveDisputeInvoice);
router.delete('/:id/items/:itemId', checkApiAccess, invoiceController.handleRemoveInvoiceItem);

export { router as invoiceRoutes };
