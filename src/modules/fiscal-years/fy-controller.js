const asyncHandler = require("express-async-handler");
const {
  processAddFiscalYear,
  processUpdateFiscalYear,
  processActivateFiscalYear,
} = require("./fy-service");

const handleAddFiscalYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const message = await processAddFiscalYear({ ...payload, schoolId });
  res.json(message);
});

const handleUpdateFiscalYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: fiscalYearId } = req.params;
  const message = await processUpdateFiscalYear({
    ...payload,
    schoolId,
    fiscalYearId,
  });
  res.json(message);
});

const handleGetAllFiscalYears = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const data = await processAddFiscalYear({ ...payload, schoolId });
  res.json({ data });
});

const handleActivateFiscalYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: fiscalYearId } = req.params;
  const message = await processActivateFiscalYear({ fiscalYearId, schoolId });
  res.json(message);
});

module.exports = {
  handleAddFiscalYear,
  handleUpdateFiscalYear,
  handleGetAllFiscalYears,
  handleActivateFiscalYear,
};
