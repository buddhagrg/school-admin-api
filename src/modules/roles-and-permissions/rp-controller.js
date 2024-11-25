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
} = require("./rp-service");

const handleGetRoles = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const roles = await fetchRoles(schoolId);
  res.json({ roles });
});

const handleAddRole = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const message = await addRole({ name, schoolId });
  res.json(message);
});

const handleUpdateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const message = await updateRole({ id, name, schoolId });
  res.json(message);
});

const handleRoleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { schoolId } = req.user;
  const message = await processRoleStatus({ id, status, schoolId });
  res.json(message);
});

const handleAddRolePermission = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { permissions } = req.body;
  const { schoolId } = req.user;
  const message = await addRolePermission({ roleId, permissions, schoolId });
  res.json(message);
});

const handleGetRolePermission = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { schoolId } = req.user;
  const permissions = await getRolePermissions({ roleId, schoolId });
  res.json({ permissions });
});

const handleGetUsersByRoleId = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { schoolId } = req.user;
  const users = await fetchUsersByRoleId({ roleId, schoolId });
  res.json({ users });
});
const handleSwitchRole = asyncHandler(async (req, res) => {
  const { userId, roleId } = req.body;
  const { schoolId } = req.user;
  const message = await processSwitchRole({ userId, roleId, schoolId });
  res.json(message);
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
