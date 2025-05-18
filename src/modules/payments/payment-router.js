import express from 'express';
import * as paymentController from './payment-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.post('/general/pay', checkApiAccess, paymentController.handleDoGeneralPayment);
router.get('/methods', checkApiAccess, paymentController.handleGetAllPaymentMethods);
router.post('/methods', checkApiAccess, paymentController.handleAddPaymentMethod);
router.put('/methods/:id', checkApiAccess, paymentController.handleUpdatePaymentMethod);
router.delete('/methods/:id', checkApiAccess, paymentController.handleDeactivatePaymentMethod);

export { router as paymentRoutes };
