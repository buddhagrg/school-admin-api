import express from 'express';
import * as depositController from './deposit-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

router.get('', checkApiAccess, depositController.handleGetDeposits);
router.post('', checkApiAccess, depositController.handleAddDeposit);
router.get('/:id', checkApiAccess, depositController.handleGetDeposit);
router.put('/:id', checkApiAccess, depositController.handleUpdateDeposit);
router.post('/:id/refund', checkApiAccess, depositController.handleRefundDeposit);

export { router as depositRoutes };
