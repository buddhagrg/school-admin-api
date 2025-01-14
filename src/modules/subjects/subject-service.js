const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  addSubject,
  updateSubject,
  deleteSubject,
  getAllSubjects,
} = require("./subject-repository");

const processAddSubject = async (payload) => {
  const affectedRow = await addSubject(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add subject");
  }

  return { message: "Subject added successfully" };
};

const processUpdateSubject = async (payload) => {
  const affectedRow = await updateSubject(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update subject");
  }

  return { message: "Subject updated successfully" };
};

const processDeleteSubject = async (payload) => {
  const affectedRow = await deleteSubject(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete subject");
  }

  return { message: "Subject deleted successfully" };
};

const processGetAllSubjects = async (payload) => {
  const subjects = await getAllSubjects(payload);
  if (subjects.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  return { subjects };
};

module.exports = {
  processAddSubject,
  processUpdateSubject,
  processDeleteSubject,
  processGetAllSubjects,
};
