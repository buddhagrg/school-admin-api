const asyncHandler = require("express-async-handler");
const {
  fetchRoles,
  addRole,
  updateRole,
  processRoleStatus,
  addRolePermission,
  getRolePermissions,
  fetchUsersByRoleId,
  processSwitchRole,
} = require("./role-service");

const handleGetRoles = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await fetchRoles(schoolId);
  res.json(response);
});

const handleAddRole = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await addRole({ name, schoolId });
  res.json(response);
});

const handleUpdateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await updateRole({ id, name, schoolId });
  res.json(response);
});

const handleRoleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { schoolId } = req.user;
  const response = await processRoleStatus({ id, status, schoolId });
  res.json(response);
});

const handleAddRolePermission = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { permissions } = req.body;
  const { schoolId } = req.user;
  const response = await addRolePermission({ roleId, permissions, schoolId });
  res.json(response);
});

const handleGetRolePermission = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { schoolId } = req.user;
  const response = await getRolePermissions({ roleId, schoolId });
  res.json(response);
});

const handleGetUsersByRoleId = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { schoolId } = req.user;
  const response = await fetchUsersByRoleId({ roleId, schoolId });
  res.json(response);
});
const handleSwitchRole = asyncHandler(async (req, res) => {
  const { userId, roleId } = req.body;
  const { schoolId } = req.user;
  const response = await processSwitchRole({ userId, roleId, schoolId });
  res.json(response);
});

module.exports = {
  handleAddRole,
  handleGetRoles,
  handleUpdateRole,
  handleRoleStatus,
  handleAddRolePermission,
  handleGetRolePermission,
  handleGetUsersByRoleId,
  handleSwitchRole,
};
