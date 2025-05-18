import asyncHandler from 'express-async-handler';
import {
  processAddFiscalYear,
  processUpdateFiscalYear,
  processActivateFiscalYear,
  processGetAllFiscalYears
} from './fy-service.js';

export const handleAddFiscalYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddFiscalYear({ ...payload, schoolId });
  res.json(response);
});

export const handleUpdateFiscalYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: fiscalYearId } = req.params;
  const response = await processUpdateFiscalYear({
    ...payload,
    schoolId,
    fiscalYearId
  });
  res.json(response);
});

export const handleGetAllFiscalYears = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllFiscalYears(schoolId);
  res.json(response);
});

export const handleActivateFiscalYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: fiscalYearId } = req.params;
  const response = await processActivateFiscalYear({ fiscalYearId, schoolId });
  res.json(response);
});
