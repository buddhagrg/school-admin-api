const asyncHandler = require("express-async-handler");
const {
  processAddPeriod,
  processUpdatePeriod,
  processDeletePeriod,
  processGetAllPeriods,
  processAssignPeriodDates,
  processUpdatePeriodOrder,
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
  const response = await processGetAllPeriods(schoolId);
  res.json(response);
});

const handleAssignPeriodDates = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAssignPeriodDates({ ...payload, schoolId });
  res.json(response);
});

const handleUpdatePeriodOrder = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const payload = req.body;
  const response = await processUpdatePeriodOrder({
    schoolId,
    periods: payload,
    academicLevelId,
  });
  res.json(response);
});

module.exports = {
  handleAddPeriod,
  handleUpdatePeriod,
  handleDeletePeriod,
  handleGetAllPeriods,
  handleAssignPeriodDates,
  handleUpdatePeriodOrder,
};
