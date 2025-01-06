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
  const message = await processAddPeriod({ ...payload, schoolId });
  res.json(message);
});

const handleUpdatePeriod = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: academicPeriodId } = req.params;
  const message = await processUpdatePeriod({
    ...payload,
    schoolId,
    academicPeriodId,
  });
  res.json(message);
});

const handleDeletePeriod = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicPeriodId } = req.params;
  const message = await processDeletePeriod({
    schoolId,
    academicPeriodId,
  });
  res.json(message);
});

const handleGetAllPeriods = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const data = await processGetAllPeriods(schoolId);
  res.json({ data });
});

const handleAssignPeriodDates = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const data = await processAssignPeriodDates({ ...payload, schoolId });
  res.json({ data });
});

module.exports = {
  handleAddPeriod,
  handleUpdatePeriod,
  handleDeletePeriod,
  handleGetAllPeriods,
  handleAssignPeriodDates,
};
