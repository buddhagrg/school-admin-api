const asyncHandler = require("express-async-handler");
const {
  processGetAllSchools,
  processGetSchool,
  processAddSchool,
  processUpdateSchool,
  processDeleteSchool,
} = require("./school-service");

const handleGetAllSchools = asyncHandler(async (req, res) => {
  const data = await processGetAllSchools();
  res.json({ data });
});

const handleGetSchool = asyncHandler(async (req, res) => {
  const { id: schoolId } = req.params;
  const school = await processGetSchool(schoolId);
  res.json(school);
});

const handleAddSchool = asyncHandler(async (req, res) => {
  const payload = await req.body;
  const { id: userId } = req.user;
  const message = await processAddSchool({ ...payload, userId });
  res.json(message);
});

const handleUpdateSchool = asyncHandler(async (req, res) => {
  const { id: schoolId } = req.params;
  const payload = await req.body;
  const { id: userId } = req.user;
  const message = await processUpdateSchool({ ...payload, userId, schoolId });
  res.json(message);
});

const handleDeleteSchool = asyncHandler(async (req, res) => {
  const { id: schoolId } = req.params;
  const message = await processDeleteSchool(schoolId);
  res.json(message);
});

module.exports = {
  handleAddSchool,
  handleGetAllSchools,
  handleUpdateSchool,
  handleDeleteSchool,
  handleGetSchool,
};
