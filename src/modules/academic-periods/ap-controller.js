const expressAsyncHandler = require("express-async-handler");
const {
  processAddPeriod,
  processUpdatePeriod,
  processDeletePeriod,
  processGetAllPeriods,
  processAssignPeriodDates,
} = require("./ap-service");

const handleAddPeriod = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddPeriod({ ...payload, schoolId });
  res.json(response);
});

const handleUpdatePeriod = expressAsyncHandler(async (req, res) => {
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

const handleDeletePeriod = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicPeriodId } = req.params;
  const response = await processDeletePeriod({
    schoolId,
    academicPeriodId,
  });
  res.json(response);
});

const handleGetAllPeriods = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllPeriods(schoolId);
  res.json(response);
});

const handleAssignPeriodDates = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAssignPeriodDates({ ...payload, schoolId });
  res.json(response);
});

module.exports = {
  handleAddPeriod,
  handleUpdatePeriod,
  handleDeletePeriod,
  handleGetAllPeriods,
  handleAssignPeriodDates,
};
