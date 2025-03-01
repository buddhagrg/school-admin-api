const asyncHandler = require("express-async-handler");
const {
  processGetAllAcademicYears,
  processAddAcademicYear,
  processActivateAcademicYear,
  processUpdateAcademicYear,
} = require("./academic-year-service");

const handleGetAllAcademicYears = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllAcademicYears(schoolId);
  res.json(response);
});

const handleAddAcademicYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddAcademicYear({ ...payload, schoolId });
  res.json(response);
});

const handleUpdatelAcademicYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicYearId } = req.params;
  const payload = req.body;
  const response = await processUpdateAcademicYear({
    ...payload,
    schoolId,
    academicYearId,
  });
  res.json(response);
});

const handleActivateAcademicYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicYearId } = req.params;
  const response = await processActivateAcademicYear({
    schoolId,
    academicYearId,
  });
  res.json(response);
});

module.exports = {
  handleGetAllAcademicYears,
  handleAddAcademicYear,
  handleUpdatelAcademicYear,
  handleActivateAcademicYear,
};
