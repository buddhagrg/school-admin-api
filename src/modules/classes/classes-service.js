const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getAllClasses,
  getClassDetail,
  addNewClass,
  updateClassDetailById,
  deleteClassById,
} = require("./classes-repository");

const fetchAllClasses = async (schoolId) => {
  const classes = await getAllClasses(schoolId);
  if (!Array.isArray(classes) || classes.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return classes;
};

const fetchClassDetail = async ({ id, schoolId }) => {
  const classDetail = await getClassDetail({ id, schoolId });
  if (!classDetail) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return classDetail;
};

const addClass = async (payload) => {
  const affectedRow = await addNewClass(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new class");
  }

  return { message: "Class added successfully" };
};

const updateClassDetail = async (payload) => {
  const affectedRow = await updateClassDetailById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update class detail");
  }
  return { message: "Class detail updated successfully" };
};

const deleteClass = async (payload) => {
  const affectedRow = await deleteClassById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete class");
  }
  return { message: "Class deleted successfully" };
};

module.exports = {
  fetchAllClasses,
  fetchClassDetail,
  addClass,
  updateClassDetail,
  deleteClass,
};
