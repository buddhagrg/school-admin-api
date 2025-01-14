const asyncHandler = require("express-async-handler");
const {
  processGetAllSchools,
  processGetSchool,
  processAddSchool,
  processUpdateSchool,
  processDeleteSchool,
} = require("./school-service");

const handleGetAllSchools = asyncHandler(async (req, res) => {
  const response = await processGetAllSchools();
  res.json(response);
});

const handleGetSchool = asyncHandler(async (req, res) => {
  const { id: schoolId } = req.params;
  const response = await processGetSchool(schoolId);
  res.json(response);
});

const handleAddSchool = asyncHandler(async (req, res) => {
  const payload = await req.body;
  const { id: userId } = req.user;
  const response = await processAddSchool({ ...payload, userId });
  res.json(response);
});

const handleUpdateSchool = asyncHandler(async (req, res) => {
  const { id: schoolId } = req.params;
  const payload = await req.body;
  const { id: userId } = req.user;
  const response = await processUpdateSchool({ ...payload, userId, schoolId });
  res.json(response);
});

const handleDeleteSchool = asyncHandler(async (req, res) => {
  const { id: schoolId } = req.params;
  const response = await processDeleteSchool(schoolId);
  res.json(response);
});

module.exports = {
  handleAddSchool,
  handleGetAllSchools,
  handleUpdateSchool,
  handleDeleteSchool,
  handleGetSchool,
};
