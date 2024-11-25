const asyncHandler = require("express-async-handler");
const {
  processGetAllAccessControls,
  processGetMyAccessControl,
} = require("./access-control-service");

const handleGetAllAccessControls = asyncHandler(async (req, res) => {
  const { staticRoleId } = req.user;
  const permissions = await processGetAllAccessControls(staticRoleId);
  res.json({ permissions });
});

const handleGetMyAccessControl = asyncHandler(async (req, res) => {
  const { roleId, staticRoleId, schoolId } = req.user;
  const permissions = await processGetMyAccessControl({
    roleId,
    schoolId,
    staticRoleId,
  });
  res.json({ permissions });
});

module.exports = {
  handleGetAllAccessControls,
  handleGetMyAccessControl,
};
