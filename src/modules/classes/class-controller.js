const asyncHandler = require("express-async-handler");
const {
  fetchAllClasses,
  addClass,
  updateClassDetail,
  processUpdateClassStatus,
  processGetClassesWithSections,
  processAddSection,
  processUpdateSection,
  processUpdateSectionStatus,
  processGetAllClassTeachers,
  processAssignClassTeacher,
  processDeleteClassTeacher,
} = require("./class-service");

const handleFetchAllClasses = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await fetchAllClasses(schoolId);
  res.json(response);
});

const handleAddClass = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await addClass({ ...payload, schoolId });
  res.json(response);
});

const handleUpdateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const payload = { id, name, schoolId };
  const response = await updateClassDetail(payload);
  res.json(response);
});

const handleUpdateClassStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const { status } = req.body;
  const response = await processUpdateClassStatus({ id, schoolId, status });
  res.json(response);
});

const handleGetClassesWithSections = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetClassesWithSections(schoolId);
  res.json(response);
});

const handleAddSection = asyncHandler(async (req, res) => {
  const { id: classId } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processAddSection({
    name,
    schoolId,
    classId,
  });
  res.json(response);
});

const handleUpdateSection = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { sectionId, id: classId } = req.params;
  const { name } = req.body;
  const response = await processUpdateSection({
    schoolId,
    classId,
    name,
    sectionId,
  });
  res.json(response);
});

const handleUpdateSectionStatus = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { sectionId, id: classId } = req.params;
  const { status } = req.body;
  const response = await processUpdateSectionStatus({
    schoolId,
    classId,
    sectionId,
    status,
  });
  res.json(response);
});

const handleGetAllClassTeachers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllClassTeachers(schoolId);
  res.json(response);
});

const handleAssignClassTeacher = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: classId, teacherId } = req.params;
  const response = await processAssignClassTeacher({
    schoolId,
    classId,
    teacherId,
  });
  res.json(response);
});

const handleDeleteClassTeacher = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;
  const response = await processDeleteClassTeacher({ schoolId, id });
  res.json(response);
});

module.exports = {
  handleFetchAllClasses,
  handleAddClass,
  handleUpdateClass,
  handleUpdateClassStatus,
  handleGetClassesWithSections,
  handleAddSection,
  handleUpdateSection,
  handleUpdateSectionStatus,
  handleGetAllClassTeachers,
  handleAssignClassTeacher,
  handleDeleteClassTeacher,
};
