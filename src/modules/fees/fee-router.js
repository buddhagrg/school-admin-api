import express from 'express';
import * as feeController from './fee-controller.js';
import { checkApiAccess } from '../../middlewares/index.js';

const router = express.Router();

// fee types
router.get('', checkApiAccess, feeController.handleGetAllFees);
router.post('', checkApiAccess, feeController.handleAddFee);
router.put('', checkApiAccess, feeController.handleUpdateFee);
// fee structures
router.get('', checkApiAccess, feeController.handleGetAllFeeStructures);
router.post('', checkApiAccess, feeController.handleAddOrUpdateFeeStructures);
// fee actions
router.get('/assign/:studentId', checkApiAccess, feeController.handleGetFeesAssignedToStudent);
router.post('/assign/:studentId', checkApiAccess, feeController.handleAssignFeeToStudent);
router.delete(
  '/:id/unassign/:studentId',
  checkApiAccess,
  feeController.handleDeleteFeeAssignedToStudent
);

export { router as feeRoutes };
