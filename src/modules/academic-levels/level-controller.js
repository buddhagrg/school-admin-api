const asyncHandler = require("express-async-handler");
const {
  processAddLevel,
  processUpdateLevel,
  processGetLevels,
} = require("./level-service");

const handleAddLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddLevel({ ...payload, schoolId });
  res.json(response);
});

const handleUpdateLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: levelId } = req.params;
  const payload = req.body;
  const response = await processUpdateLevel({ ...payload, schoolId, levelId });
  res.json(response);
});

const handleGetLevels = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetLevels(schoolId);
  res.json(response);
});

module.exports = {
  handleAddLevel,
  handleUpdateLevel,
  handleGetLevels,
};
