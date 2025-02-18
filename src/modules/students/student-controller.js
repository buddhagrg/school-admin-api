const asyncHandler = require("express-async-handler");
const {
  addNewStudent,
  getStudentDetail,
  updateStudent,
  processGetStudentDueFees,
} = require("./student-service");

const handleAddStudent = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await addNewStudent({ ...payload, schoolId });
  res.json(response);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const response = await updateStudent({ ...payload, userId, schoolId });
  res.json(response);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await getStudentDetail({ id, schoolId });
  res.json(response);
});

const handleGetStudentDueFees = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { academicYearId, studentId } = req.query;
  const response = await processGetStudentDueFees({
    schoolId,
    academicYearId,
    studentId,
  });
  res.json(response);
});

module.exports = {
  handleGetStudentDetail,
  handleAddStudent,
  handleUpdateStudent,
  handleGetStudentDueFees,
};
