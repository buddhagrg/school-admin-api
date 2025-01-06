const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getAllExamNames,
  addExamName,
  updateExamName,
  deleteExamName,
  addExamDetail,
  getExamRoutine,
  addMarks,
  getExamMarksheet,
  getExamDetail,
  updateExamDetail,
  updateMarks,
  getMarks,
} = require("./exam-repository");

const processGetAllExamNames = async (schoolId) => {
  const exams = await getAllExamNames(schoolId);
  if (exams.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return exams;
};

const processAddExamName = async (payload) => {
  const affectedRow = await addExamName(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add exam name");
  }
  return { message: "Exam name added successfully" };
};

const processUpdateExamName = async (payload) => {
  const affectedRow = await updateExamName(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update exam name");
  }
  return { message: "Exam name updated successfully" };
};

const processDeleteExamName = async (payload) => {
  const affectedRow = await deleteExamName(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete exam name");
  }
  return { message: "Exam name deleted successfully" };
};

const processAddExamDetail = async (payload) => {
  const result = await addExamDetail(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message || "Unable to add exam detail");
  }
  return { message: result.message };
};

const processUpdateExamDetail = async (payload) => {
  const result = await updateExamDetail(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message || "Unable to update exam detail");
  }
  return { message: result.message };
};

const processGetExamRoutine = async (payload) => {
  const routines = await getExamRoutine(payload);
  if (routines.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return routines;
};

const processGetMarks = async (payload) => {
  const marks = await getMarks(payload);
  if (marks.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return marks;
};

const processAddMarks = async (payload) => {
  const result = await addMarks(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message || "Unable to add marks");
  }
  return { message: result.message };
};

const processUpdateMarks = async (payload) => {
  const result = await updateMarks(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message || "Unable to update marks");
  }
  return { message: result.message };
};

const processGetExamMarksheet = async (payload) => {
  const marksheets = await getExamMarksheet(payload);
  if (marksheets.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return marksheets;
};

const processGetExamDetail = async (payload) => {
  const examDetails = await getExamDetail(payload);
  if (examDetails.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return examDetails;
};

module.exports = {
  processGetAllExamNames,
  processAddExamName,
  processUpdateExamName,
  processDeleteExamName,
  processAddExamDetail,
  processGetExamRoutine,
  processAddMarks,
  processGetExamMarksheet,
  processGetExamDetail,
  processUpdateExamDetail,
  processUpdateMarks,
  processGetMarks,
};
