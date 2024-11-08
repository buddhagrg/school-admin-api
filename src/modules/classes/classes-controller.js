const asyncHandler = require("express-async-handler");
const {
  fetchAllClasses,
  fetchClassDetail,
  addClass,
  updateClassDetail,
  deleteClass,
} = require("./classes-service");

const handleFetchAllClasses = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const classes = await fetchAllClasses(schoolId);
  res.json({ classes });
});

const handleFetchClassDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const classDetail = await fetchClassDetail({ id, schoolId });
  res.json(classDetail);
});

const handleAddClass = asyncHandler(async (req, res) => {
  const { name, sections } = req.body;
  const { schoolId } = req.user;
  const payload = { name, sections, schoolId };
  const message = await addClass(payload);
  res.json(message);
});

const handleUpdateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, sections } = req.body;
  const { schoolId } = req.user;

  const payload = { id, name, sections, schoolId };
  const message = await updateClassDetail(payload);
  res.json(message);
});

const handleDeleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;

  const message = await deleteClass({ id, schoolId });
  res.json(message);
});

module.exports = {
  handleFetchAllClasses,
  handleFetchClassDetail,
  handleAddClass,
  handleUpdateClass,
  handleDeleteClass,
};
