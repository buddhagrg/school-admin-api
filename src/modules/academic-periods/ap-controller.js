const asyncHandler = require("express-async-handler");
const {
  processAddPeriod,
  processUpdatePeriod,
  processDeletePeriod,
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

module.exports = {
  handleAddPeriod,
  handleUpdatePeriod,
  handleDeletePeriod,
};
