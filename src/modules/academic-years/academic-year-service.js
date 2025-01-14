const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getAllAcademicYears,
  addAcademicYear,
  updateAcademicYear,
  activateAcademicYear,
} = require("./academic-year-repository");

const processGetAllAcademicYears = async (schoolId) => {
  const academicYears = await getAllAcademicYears(schoolId);
  if (academicYears.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { academicYears };
};

const processAddAcademicYear = async (payload) => {
  const affectedRow = await addAcademicYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add academic year");
  }
  return { message: "Academic year added successfully" };
};

const processUpdateAcademicYear = async (payload) => {
  const affectedRow = await updateAcademicYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update academic year");
  }
  return { message: "Academic year updated successfully" };
};

const processActivateAcademicYear = async (payload) => {
  const affectedRow = await activateAcademicYear(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to activate academic year");
  }

  return { message: "Academic year activated successfully" };
};

module.exports = {
  processGetAllAcademicYears,
  processAddAcademicYear,
  processUpdateAcademicYear,
  processActivateAcademicYear,
};
