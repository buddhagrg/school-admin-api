const asyncHandler = require("express-async-handler");
const {
  processAddSubject,
  processUpdateSubject,
  processDeleteSubject,
  processGetAllSubjects,
} = require("./subject-service");

const handleAddSubject = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddSubject({ ...payload, schoolId });
  res.json(response);
});

const handleUpdateSubject = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processUpdateSubject({ ...payload, schoolId });
  res.json(response);
});

const handleDeleteSubject = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processDeleteSubject({ ...payload, schoolId });
  res.json(response);
});

const handleGetAllSubjects = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processGetAllSubjects({ ...payload, schoolId });
  res.json(response);
});

module.exports = {
  handleAddSubject,
  handleUpdateSubject,
  handleDeleteSubject,
  handleGetAllSubjects,
};
