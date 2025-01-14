const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getClassTeachers,
  addClassTeacher,
  getClassTeacherById,
  updateClassTeacherById,
  findAllTeachers,
} = require("./class-teacher-repository");

const fetchAllClassTeachers = async (schoolId) => {
  const classTeachers = await getClassTeachers(schoolId);
  if (!Array.isArray(classTeachers) || classTeachers.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return { classTeachers };
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
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
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
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { teachers };
};

module.exports = {
  fetchAllClassTeachers,
  addNewClassTeacher,
  fetchClassTeacherDetailById,
  updateClassTeacher,
  getAllTeachers,
};
