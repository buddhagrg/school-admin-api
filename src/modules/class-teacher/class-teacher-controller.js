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
  const classTeachers = await fetchAllClassTeachers(schoolId);
  res.json({ classTeachers });
});

const handleGetClassTeacherDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const detail = await fetchClassTeacherDetailById({ id, schoolId });
  res.json(detail);
});

const handleAddClassTeacher = asyncHandler(async (req, res) => {
  const { class: className, section, teacher } = req.body;
  const { schoolId } = req.user;
  const message = await addNewClassTeacher({
    className,
    section,
    teacher,
    schoolId,
  });
  res.json(message);
});

const handleUpdateClassTeacherDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { class: className, section, teacher } = req.body;
  const { schoolId } = req.user;
  const message = await updateClassTeacher({
    className,
    section,
    teacher,
    id,
    schoolId,
  });
  res.json(message);
});

const handleGetAllTeachers = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const teachers = await getAllTeachers(schoolId);
  res.json({ teachers });
});

module.exports = {
  handleGetClassTeachers,
  handleGetClassTeacherDetail,
  handleAddClassTeacher,
  handleUpdateClassTeacherDetail,
  handleGetAllTeachers,
};
