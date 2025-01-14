const asyncHandler = require("express-async-handler");
const {
  processGetAllSections,
  processGetSectionById,
  processUpdateSectionById,
  processDeleteSectionById,
  processAddNewSection,
} = require("./section-service");

const handleGetAllSections = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllSections(schoolId);
  res.json(response);
});

const handleAddNewSection = asyncHandler(async (req, res) => {
  const { sectionNames, classId } = req.body;
  const { schoolId } = req.user;
  const response = await processAddNewSection({
    sectionNames,
    schoolId,
    classId,
  });
  res.json(response);
});

const handleGetSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processGetSectionById({ id, schoolId });
  res.json(response);
});

const handleUpdateSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateSectionById({ id, name, schoolId });
  res.json(response);
});

const handleDeleteSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processDeleteSectionById({ id, schoolId });
  res.json(response);
});

module.exports = {
  handleGetAllSections,
  handleGetSectionById,
  handleUpdateSectionById,
  handleDeleteSectionById,
  handleAddNewSection,
};
