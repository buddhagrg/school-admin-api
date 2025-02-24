const asyncHandler = require("express-async-handler");
const {
  processGetRoles,
  processAddRole,
  processUpdateRole,
  processUpdateRoleStatus,
  processAssignPermissionsForRole,
  processGetRolePermissions,
  processGetRoleUsers,
  processDeletePermissionsOfRole,
} = require("./role-service");

const handleGetRoles = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetRoles(schoolId);
  res.json(response);
});

const handleAddRole = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processAddRole({ name, schoolId });
  res.json(response);
});

const handleUpdateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateRole({ id, name, schoolId });
  res.json(response);
});

const handleUpdateRoleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateRoleStatus({ id, status, schoolId });
  res.json(response);
});

const handleAssignPermissionsForRole = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { permissions } = req.body;
  const { schoolId } = req.user;
  const response = await processAssignPermissionsForRole({
    roleId,
    permissions,
    schoolId,
  });
  res.json(response);
});

const handleGetRolePermissions = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { schoolId } = req.user;
  const response = await processGetRolePermissions({ roleId, schoolId });
  res.json(response);
});

const handleGetRoleUsers = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { schoolId } = req.user;
  const response = await processGetRoleUsers({ roleId, schoolId });
  res.json(response);
});

const handleDeletePermissionsOfRole = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { schoolId } = req.user;
  const { permissions } = req.body;
  const response = await processDeletePermissionsOfRole({
    roleId,
    schoolId,
    permissions,
  });
  res.json(response);
});

module.exports = {
  handleAddRole,
  handleGetRoles,
  handleUpdateRole,
  handleUpdateRoleStatus,
  handleAssignPermissionsForRole,
  handleGetRolePermissions,
  handleGetRoleUsers,
  handleDeletePermissionsOfRole,
};
