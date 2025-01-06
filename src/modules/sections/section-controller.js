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
  const data = await processGetAllSections(schoolId);
  res.json({ data });
});

const handleAddNewSection = asyncHandler(async (req, res) => {
  const { sectionNames, classId } = req.body;
  const { schoolId } = req.user;
  const message = await processAddNewSection({
    sectionNames,
    schoolId,
    classId,
  });
  res.json(message);
});

const handleGetSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const section = await processGetSectionById({ id, schoolId });
  res.json(section);
});

const handleUpdateSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const message = await processUpdateSectionById({ id, name, schoolId });
  res.json(message);
});

const handleDeleteSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const message = await processDeleteSectionById({ id, schoolId });
  res.json(message);
});

module.exports = {
  handleGetAllSections,
  handleGetSectionById,
  handleUpdateSectionById,
  handleDeleteSectionById,
  handleAddNewSection,
};
