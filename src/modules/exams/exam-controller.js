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
  const response = await processGetAllExamNames(schoolId);
  res.json(response);
});

const handleAddExamName = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { name } = req.body;
  const response = await processAddExamName({ schoolId, name });
  res.json(response);
});

const handleUpdateExamName = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { name } = req.body;
  const { id: examId } = req.params;
  const response = await processUpdateExamName({ schoolId, name, examId });
  res.json(response);
});

const handleDeleteExamName = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: examId } = req.params;
  const response = await processDeleteExamName({ schoolId, examId });
  res.json(response);
});

const handleAddExamDetail = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const action = "a";
  const response = await processAddExamDetail({ ...payload, schoolId, action });
  res.json(response);
});

const handleUpdateExamDetail = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const action = "u";
  const response = await processUpdateExamDetail({
    ...payload,
    schoolId,
    action,
  });
  res.json(response);
});

const handleGetExamRoutine = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processGetExamRoutine({ ...payload, schoolId });
  res.json(response);
});

const handleGetMarks = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processGetMarks({ ...payload, schoolId });
  res.json(response);
});

const handleAddMarks = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const action = "a";
  const response = await processAddMarks({ ...payload, schoolId, action });
  res.json(response);
});

const handleUpdateMarks = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const action = "u";
  const response = await processUpdateMarks({ ...payload, schoolId, action });
  res.json(response);
});

const handleGetExamMarksheet = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: userId } = req.params;
  const response = await processGetExamMarksheet({
    ...payload,
    schoolId,
    userId,
  });
  res.json(response);
});

const handleGetExamDetail = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const { id: examId } = req.params;
  const response = await processGetExamDetail({
    ...payload,
    examId,
    schoolId,
  });
  res.json(response);
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
