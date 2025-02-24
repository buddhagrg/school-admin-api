const asyncHandler = require("express-async-handler");
const {
  processAddPeriod,
  processUpdatePeriod,
  processDeletePeriod,
  processGetAllPeriods,
  processGetAllPeriodDates,
  processDefinePeriodsDates,
} = require("./ap-service");

const handleAddPeriod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddPeriod({ ...payload, schoolId });
  res.json(response);
});

const handleUpdatePeriod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: academicPeriodId } = req.params;
  const response = await processUpdatePeriod({
    ...payload,
    schoolId,
    academicPeriodId,
  });
  res.json(response);
});

const handleDeletePeriod = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicPeriodId } = req.params;
  const response = await processDeletePeriod({
    schoolId,
    academicPeriodId,
  });
  res.json(response);
});

const handleGetAllPeriods = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { dates } = req.query;
  const response = dates
    ? await processGetAllPeriodDates(schoolId)
    : await processGetAllPeriods(schoolId);
  res.json(response);
});

const handleDefinePeriodsDates = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { periods } = req.body;
  const response = await processDefinePeriodsDates({ ...periods, schoolId });
  res.json(response);
});

module.exports = {
  handleAddPeriod,
  handleUpdatePeriod,
  handleDeletePeriod,
  handleGetAllPeriods,
  handleDefinePeriodsDates,
};
