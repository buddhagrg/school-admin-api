const asyncHandler = require("express-async-handler");
const {
  processGetAllPermissions,
  processGetMyPermissions,
  processAddPermission,
  processUpdatePermission,
  processDeletePermission,
} = require("./permission-service");

const handleGetAllPermissions = asyncHandler(async (req, res) => {
  const { staticRoleId } = req.user;
  const response = await processGetAllPermissions(staticRoleId);
  res.json(response);
});

const handleGetMyPermissions = asyncHandler(async (req, res) => {
  const { roleId, staticRoleId, schoolId } = req.user;
  const response = await processGetMyPermissions({
    roleId,
    schoolId,
    staticRoleId,
  });
  res.json(response);
});

const handleAddPermission = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processAddPermission(payload);
  res.json(response);
});

const handleUpdatePermission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const response = await processUpdatePermission({ ...payload, id });
  res.json(response);
});

const handleDeletePermission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await processDeletePermission(id);
  res.json(response);
});

module.exports = {
  handleGetAllPermissions,
  handleGetMyPermissions,
  handleAddPermission,
  handleUpdatePermission,
  handleDeletePermission,
};
