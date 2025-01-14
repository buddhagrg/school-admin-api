const asyncHandler = require("express-async-handler");
const {
  fetchAllClassTeachers,
  fetchClassTeacherDetailById,
  addNewClassTeacher,
  updateClassTeacher,
  getAllTeachers,
} = require("./class-teacher-service");

const handleGetClassTeachers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await fetchAllClassTeachers(schoolId);
  res.json(response);
});

const handleGetClassTeacherDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await fetchClassTeacherDetailById({ id, schoolId });
  res.json(response);
});

const handleAddClassTeacher = asyncHandler(async (req, res) => {
  const { class: classId, section, teacher } = req.body;
  const { schoolId } = req.user;
  const response = await addNewClassTeacher({
    classId,
    section,
    teacher,
    schoolId,
  });
  res.json(response);
});

const handleUpdateClassTeacherDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { class: classId, section, teacher } = req.body;
  const { schoolId } = req.user;
  const response = await updateClassTeacher({
    classId,
    section,
    teacher,
    id,
    schoolId,
  });
  res.json(response);
});

const handleGetAllTeachers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await getAllTeachers(schoolId);
  res.json(response);
});

module.exports = {
  handleGetClassTeachers,
  handleGetClassTeacherDetail,
  handleAddClassTeacher,
  handleUpdateClassTeacherDetail,
  handleGetAllTeachers,
};
