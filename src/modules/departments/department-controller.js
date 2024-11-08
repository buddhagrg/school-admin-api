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
  const departments = await processGetAllDepartments(schoolId);
  res.json({ departments });
});

const handleAddNewDepartment = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const message = await processAddNewDepartment({ name, schoolId });
  res.json(message);
});

const handleGetDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const department = await processGetDepartmentById({ id, schoolId });
  res.json(department);
});

const handleUpdateDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const message = await processUpdateDepartmentById({ id, name, schoolId });
  res.json(message);
});

const handleDeleteDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const message = await processDeleteDepartmentById({ id, schoolId });
  res.json(message);
});

module.exports = {
  handleGetAllDepartments,
  handleGetDepartmentById,
  handleUpdateDepartmentById,
  handleDeleteDepartmentById,
  handleAddNewDepartment,
};
