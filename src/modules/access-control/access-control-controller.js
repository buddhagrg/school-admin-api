const asyncHandler = require("express-async-handler");
const {
  processGetAllAccessControls,
  processGetMyAccessControl,
  processAddAccessControl,
  processUpdateAccessControl,
  processDeleteAccessControl,
} = require("./access-control-service");

const handleGetAllAccessControls = asyncHandler(async (req, res) => {
  const { staticRoleId } = req.user;
  const response = await processGetAllAccessControls(staticRoleId);
  res.json(response);
});

const handleGetMyAccessControl = asyncHandler(async (req, res) => {
  const { roleId, staticRoleId, schoolId } = req.user;
  const response = await processGetMyAccessControl({
    roleId,
    schoolId,
    staticRoleId,
  });
  res.json(response);
});

const handleAddAccessControl = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processAddAccessControl(payload);
  res.json(response);
});

const handleUpdateAccessControl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const response = await processUpdateAccessControl({ ...payload, id });
  res.json(response);
});

const handleDeleteAccessControl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await processDeleteAccessControl(id);
  res.json(response);
});

module.exports = {
  handleGetAllAccessControls,
  handleGetMyAccessControl,
  handleAddAccessControl,
  handleUpdateAccessControl,
  handleDeleteAccessControl,
};
