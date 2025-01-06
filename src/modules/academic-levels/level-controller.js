const asyncHandler = require("express-async-handler");
const {
  processAddLevel,
  processUpdateLevel,
  processGetLevels,
} = require("./level-service");

const handleAddLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const message = await processAddLevel({ ...payload, schoolId });
  res.json(message);
});

const handleUpdateLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: levelId } = req.params;
  const payload = req.body;
  const message = await processUpdateLevel({ ...payload, schoolId, levelId });
  res.json(message);
});

const handleGetLevels = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const data = await processGetLevels(schoolId);
  res.json({ data });
});

module.exports = {
  handleAddLevel,
  handleUpdateLevel,
  handleGetLevels,
};
