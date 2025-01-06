const asyncHandler = require("express-async-handler");
const {
  processGetAllAcademicYears,
  processAddAcademicYear,
  processActivateAcademicYear,
} = require("./academic-year-service");

const handleGetAllAcademicYears = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const data = await processGetAllAcademicYears(schoolId);
  res.json({ data });
});

const handleAddAcademicYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const data = await processAddAcademicYear({ ...payload, schoolId });
  res.json({ data });
});

const handleUpdatelAcademicYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicYearId } = req.params;
  const payload = req.body;
  const data = await processGetAllAcademicYears({
    ...payload,
    schoolId,
    academicYearId,
  });
  res.json({ data });
});

const handleActivateAcademicYear = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: academicYearId } = req.params;
  const message = await processActivateAcademicYear({
    schoolId,
    academicYearId,
  });
  res.json(message);
});

module.exports = {
  handleGetAllAcademicYears,
  handleAddAcademicYear,
  handleUpdatelAcademicYear,
  handleActivateAcademicYear,
};
