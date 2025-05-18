import express from 'express';
import { checkApiAccess } from '../../middlewares/index.js';
import * as fyController from './fy-controller.js';

const router = express.Router();

router.get('', checkApiAccess, fyController.handleGetAllFiscalYears);
router.post('', checkApiAccess, fyController.handleAddFiscalYear);
router.put('/:id', checkApiAccess, fyController.handleUpdateFiscalYear);
router.patch('/:id/activate', checkApiAccess, fyController.handleActivateFiscalYear);

export { router as fiscalYearRoutes };
