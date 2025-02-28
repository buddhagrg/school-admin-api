const asyncHandler = require("express-async-handler");
const {
  processAddLevel,
  processUpdateLevel,
  processGetLevels,
  processAddClassToLevel,
  processGetAcademicLevelsWithPeriods,
  processDeleteLevel,
  processGetLevelsWithClasses,
  processDeleteLevelFromClass,
  processReorderPeriods,
  processGetPeriodsDates,
  processUpdatePeriodsDates,
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
  const { classId } = req.body;
  const { id: academicLevelId } = req.params;
  const response = await processAddClassToLevel({
    schoolId,
    classId,
    academicLevelId,
  });
  res.json(response);
});

const handleGetAcademicLevelsWithPeriods = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAcademicLevelsWithPeriods(schoolId);
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

const handleReorderPeriods = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const { periods } = req.body;
  const response = await processReorderPeriods({
    schoolId,
    periods,
    academicLevelId,
  });
  res.json(response);
});

const handleGetPeriodsDates = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const response = await processGetPeriodsDates({
    schoolId,
    academicLevelId,
  });
  res.json(response);
});

const handleUpdatePeriodsDates = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicLevelId } = req.params;
  const { periodsDates } = req.body;
  const response = await processUpdatePeriodsDates({
    schoolId,
    academicLevelId,
    periodsDates,
  });
  res.json(response);
});

module.exports = {
  handleAddLevel,
  handleUpdateLevel,
  handleGetLevels,
  handleAddClassToLevel,
  handleGetAcademicLevelsWithPeriods,
  handleDeleteLevel,
  handleGetLevelsWithClasses,
  handleDeleteLevelFromClass,
  handleReorderPeriods,
  handleGetPeriodsDates,
  handleUpdatePeriodsDates,
};
