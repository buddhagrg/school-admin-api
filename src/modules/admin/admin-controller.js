const asyncHandler = require("express-async-handler");
const {
  processAddSchool,
  processGetAllSchools,
  processUpdateSchool,
  processDeleteSchool,
  processAddAccessControl,
  processUpdateAccessContorl,
  processDeleteAccessControl,
  processGetSchool,
} = require("./admin-service");

const handleGetAllSchools = asyncHandler(async (req, res) => {
  const schools = await processGetAllSchools();
  res.json({ schools });
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

const handleAddAccessControl = asyncHandler(async (req, res) => {
  const payload = req.body;
  const message = await processAddAccessControl(payload);
  res.json(message);
});

const handleUpdateAccessControl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const message = await processUpdateAccessContorl({ ...payload, id });
  res.json(message);
});

const handleDeleteAccessControl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const message = await processDeleteAccessControl(id);
  res.json(message);
});

module.exports = {
  handleAddSchool,
  handleGetAllSchools,
  handleUpdateSchool,
  handleDeleteSchool,
  handleAddAccessControl,
  handleUpdateAccessControl,
  handleDeleteAccessControl,
  handleGetSchool,
};
