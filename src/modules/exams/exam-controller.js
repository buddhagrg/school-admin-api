const asyncHandler = require("express-async-handler");
const {
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
} = require("./exam-service");

const handleGetAllExamNames = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const data = await processGetAllExamNames(schoolId);
  res.json({ data });
});

const handleAddExamName = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { name } = req.body;
  const message = await processAddExamName({ schoolId, name });
  res.json(message);
});

const handleUpdateExamName = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { name } = req.body;
  const { id: examId } = req.params;
  const message = await processUpdateExamName({ schoolId, name, examId });
  res.json(message);
});

const handleDeleteExamName = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: examId } = req.params;
  const message = await processDeleteExamName({ schoolId, examId });
  res.json(message);
});

const handleAddExamDetail = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const action = "a";
  const message = await processAddExamDetail({ ...payload, schoolId, action });
  res.json(message);
});

const handleUpdateExamDetail = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const action = "u";
  const message = await processUpdateExamDetail({
    ...payload,
    schoolId,
    action,
  });
  res.json(message);
});

const handleGetExamRoutine = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const data = await processGetExamRoutine({ ...payload, schoolId });
  res.json({ data });
});

const handleGetMarks = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const data = await processGetMarks({ ...payload, schoolId });
  res.json({ data });
});

const handleAddMarks = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const action = "a";
  const message = await processAddMarks({ ...payload, schoolId, action });
  res.json(message);
});

const handleUpdateMarks = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const action = "u";
  const message = await processUpdateMarks({ ...payload, schoolId, action });
  res.json(message);
});

const handleGetExamMarksheet = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: userId } = req.params;
  const data = await processGetExamMarksheet({
    ...payload,
    schoolId,
    userId,
  });
  res.json({ data });
});

const handleGetExamDetail = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: examId } = req.params;
  const data = await processGetExamDetail({
    ...payload,
    examId,
    schoolId,
  });
  res.json({ data });
});

module.exports = {
  handleGetAllExamNames,
  handleAddExamName,
  handleUpdateExamName,
  handleDeleteExamName,
  handleAddExamDetail,
  handleGetExamRoutine,
  handleAddMarks,
  handleGetExamMarksheet,
  handleGetExamDetail,
  handleUpdateExamDetail,
  handleUpdateMarks,
  handleGetMarks,
};
