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
  const data = await processGetAllAccessControls(staticRoleId);
  res.json({ data });
});

const handleGetMyAccessControl = asyncHandler(async (req, res) => {
  const { roleId, staticRoleId, schoolId } = req.user;
  const data = await processGetMyAccessControl({
    roleId,
    schoolId,
    staticRoleId,
  });
  res.json({ data });
});

const handleAddAccessControl = asyncHandler(async (req, res) => {
  const payload = req.body;
  const message = await processAddAccessControl(payload);
  res.json(message);
});

const handleUpdateAccessControl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const message = await processUpdateAccessControl({ ...payload, id });
  res.json(message);
});

const handleDeleteAccessControl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const message = await processDeleteAccessControl(id);
  res.json(message);
});

module.exports = {
  handleGetAllAccessControls,
  handleGetMyAccessControl,
  handleAddAccessControl,
  handleUpdateAccessControl,
  handleDeleteAccessControl,
};
