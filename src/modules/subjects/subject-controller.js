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
  const message = await processAddSubject({ ...payload, schoolId });
  res.json(message);
});

const handleUpdateSubject = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const message = await processUpdateSubject({ ...payload, schoolId });
  res.json(message);
});

const handleDeleteSubject = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const message = await processDeleteSubject({ ...payload, schoolId });
  res.json(message);
});

const handleGetAllSubjects = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const message = await processGetAllSubjects({ ...payload, schoolId });
  res.json(message);
});

module.exports = {
  handleAddSubject,
  handleUpdateSubject,
  handleDeleteSubject,
  handleGetAllSubjects,
};
