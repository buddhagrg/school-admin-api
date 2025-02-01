const asyncHandler = require("express-async-handler");
const {
  fetchAllClasses,
  fetchClassDetail,
  addClass,
  updateClassDetail,
  deleteClass,
} = require("./class-service");

const handleFetchAllClasses = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await fetchAllClasses(schoolId);
  res.json(response);
});

const handleFetchClassDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await fetchClassDetail({ id, schoolId });
  res.json(response);
});

const handleAddClass = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const payload = { name, schoolId };
  const response = await addClass(payload);
  res.json(response);
});

const handleUpdateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const payload = { id, name, schoolId };
  const response = await updateClassDetail(payload);
  res.json(response);
});

const handleDeleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await deleteClass({ id, schoolId });
  res.json(response);
});

module.exports = {
  handleFetchAllClasses,
  handleFetchClassDetail,
  handleAddClass,
  handleUpdateClass,
  handleDeleteClass,
};
