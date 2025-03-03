const asyncHandler = require("express-async-handler");
const {
  processAddFiscalYear,
  processUpdateFiscalYear,
  processActivateFiscalYear,
  processGetAllFiscalYears,
} = require("./fy-service");

const handleAddFiscalYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddFiscalYear({ ...payload, schoolId });
  res.json(response);
});

const handleUpdateFiscalYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: fiscalYearId } = req.params;
  const response = await processUpdateFiscalYear({
    ...payload,
    schoolId,
    fiscalYearId,
  });
  res.json(response);
});

const handleGetAllFiscalYears = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllFiscalYears(schoolId);
  res.json(response);
});

const handleActivateFiscalYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: fiscalYearId } = req.params;
  const response = await processActivateFiscalYear({ fiscalYearId, schoolId });
  res.json(response);
});

module.exports = {
  handleAddFiscalYear,
  handleUpdateFiscalYear,
  handleGetAllFiscalYears,
  handleActivateFiscalYear,
};
