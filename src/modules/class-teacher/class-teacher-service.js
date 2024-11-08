const { ApiError } = require("../../utils");
const {
  getClassTeachers,
  addClassTeacher,
  getClassTeacherById,
  updateClassTeacherById,
  findAllTeachers,
} = require("./class-teacher-repository");

const fetchAllClassTeachers = async (schoolId) => {
  const data = await getClassTeachers(schoolId);
  if (!Array.isArray(data) || data.length <= 0) {
    throw new ApiError(404, "Class teachers not found");
  }

  return data;
};

const addNewClassTeacher = async (payload) => {
  const affectedRow = await addClassTeacher(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add class teacher");
  }

  return { message: "Class teacher added successfully" };
};

const fetchClassTeacherDetailById = async (payload) => {
  const classTeacherDetail = await getClassTeacherById(payload);
  if (!classTeacherDetail) {
    throw new ApiError(404, "Class teacher detail not found");
  }

  return classTeacherDetail;
};

const updateClassTeacher = async (payload) => {
  const affectedRow = await updateClassTeacherById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update class teacher detail");
  }

  return { message: "Class teacher detail updated successfully" };
};

const getAllTeachers = async (schoolId) => {
  const teachers = await findAllTeachers(schoolId);
  if (teachers.length <= 0) {
    throw new ApiError(404, "Teachers not found");
  }
  return teachers;
};

module.exports = {
  fetchAllClassTeachers,
  addNewClassTeacher,
  fetchClassTeacherDetailById,
  updateClassTeacher,
  getAllTeachers,
};
