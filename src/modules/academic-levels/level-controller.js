const asyncHandler = require("express-async-handler");
const {
  processAddLevel,
  processUpdateLevel,
  processGetLevels,
  processAddClassToLevel,
  processGetAcademicStructure,
  processDeleteLevel,
  processGetLevelsWithClasses,
  processDeleteLevelFromClass,
} = require("./level-service");

const handleAddLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddLevel({ ...payload, schoolId });
  res.json(response);
});

const handleUpdateLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const payload = req.body;
  const response = await processUpdateLevel({
    ...payload,
    schoolId,
    academicLevelId,
  });
  res.json(response);
});

const handleGetLevels = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetLevels(schoolId);
  res.json(response);
});

const handleAddClassToLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId, classId } = req.params;
  const response = await processAddClassToLevel({
    schoolId,
    classId,
    academicLevelId,
  });
  res.json(response);
});

const handleGetAcademicStructure = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAcademicStructure(schoolId);
  res.json(response);
});

const handleDeleteLevel = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const response = await processDeleteLevel({ schoolId, academicLevelId });
  res.json(response);
});

const handleGetLevelsWithClasses = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetLevelsWithClasses(schoolId);
  res.json(response);
});

const handleDeleteLevelFromClass = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: classId } = req.params;
  const response = await processDeleteLevelFromClass({
    schoolId,
    classId,
  });
  res.json(response);
});

module.exports = {
  handleAddLevel,
  handleUpdateLevel,
  handleGetLevels,
  handleAddClassToLevel,
  handleGetAcademicStructure,
  handleDeleteLevel,
  handleGetLevelsWithClasses,
  handleDeleteLevelFromClass,
};
