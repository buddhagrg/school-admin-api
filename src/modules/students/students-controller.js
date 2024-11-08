const asyncHandler = require("express-async-handler");
const {
  getAllStudents,
  addNewStudent,
  getStudentDetail,
  setStudentStatus,
  updateStudent,
} = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
  const { name, section, class: className, roll } = req.query;
  const { schoolId } = req.user;
  const students = await getAllStudents({
    name,
    section,
    className,
    roll,
    schoolId,
  });
  res.json({ students });
});

const handleAddStudent = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { schoolId } = req.user;
  const message = await addNewStudent({ ...payload, schoolId });
  res.json(message);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const payload = req.body;
  const { schoolId } = req.user;
  const message = await updateStudent({ ...payload, userId, schoolId });
  res.json(message);
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const student = await getStudentDetail({ id, schoolId });
  res.json(student);
});

const handleStudentStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { id: reviewerId, schoolId } = req.user;
  const { status } = req.body;
  const message = await setStudentStatus({
    userId,
    status,
    reviewerId,
    schoolId,
  });
  res.json(message);
});

module.exports = {
  handleGetAllStudents,
  handleGetStudentDetail,
  handleAddStudent,
  handleStudentStatus,
  handleUpdateStudent,
};
