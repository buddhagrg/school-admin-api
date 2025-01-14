const asyncHandler = require("express-async-handler");
const {
  processGetAllDepartments,
  processAddNewDepartment,
  processGetDepartmentById,
  processUpdateDepartmentById,
  processDeleteDepartmentById,
} = require("./department-service");

const handleGetAllDepartments = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllDepartments(schoolId);
  res.json(response);
});

const handleAddNewDepartment = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processAddNewDepartment({ name, schoolId });
  res.json(response);
});

const handleGetDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processGetDepartmentById({ id, schoolId });
  res.json(response);
});

const handleUpdateDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateDepartmentById({ id, name, schoolId });
  res.json(response);
});

const handleDeleteDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processDeleteDepartmentById({ id, schoolId });
  res.json(response);
});

module.exports = {
  handleGetAllDepartments,
  handleGetDepartmentById,
  handleUpdateDepartmentById,
  handleDeleteDepartmentById,
  handleAddNewDepartment,
};
