const asyncHandler = require("express-async-handler");
const {
  fetchAllClasses,
  fetchClassDetail,
  addClass,
  updateClassDetail,
  processUpdateClassStatus,
  processGetClassStructure,
  processAddSection,
  processUpdateSection,
  processUpdateSectionStatus,
  processGetAllClassTeachers,
  processAssignClassTeacher,
  processGetAllTeachersOfSchool,
} = require("./class-service");

const handleFetchAllClasses = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await fetchAllClasses(schoolId);
  res.json(response);
});

const handleFetchClassDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await fetchClassDetail({ id, schoolId });
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
  const { path } = req.route;
  const status = path.includes("deactivate") ? false : true;
  const response = await processUpdateClassStatus({ id, schoolId, status });
  res.json(response);
});

const handleGetClassStructure = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetClassStructure(schoolId);
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
  const { path } = req.route;
  const status = path.includes("deactivate") ? false : true;
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

const handleGetAllTeachersOfSchool = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllTeachersOfSchool(schoolId);
  res.json(response);
});

module.exports = {
  handleFetchAllClasses,
  handleFetchClassDetail,
  handleAddClass,
  handleUpdateClass,
  handleUpdateClassStatus,
  handleGetClassStructure,
  handleAddSection,
  handleUpdateSection,
  handleUpdateSectionStatus,
  handleGetAllClassTeachers,
  handleAssignClassTeacher,
  handleGetAllTeachersOfSchool,
};
