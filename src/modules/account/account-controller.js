const asyncHandler = require("express-async-handler");
const {
  processPasswordChange,
  processGetAccountDetail,
} = require("./account-service");
const { setAllCookies, clearAllCookies } = require("../../cookie");

const handlePasswordChange = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const { id: userId, schoolId, role: roleName } = req.user;
  const { accessToken, refreshToken, csrfToken, message } =
    await processPasswordChange({
      userId,
      oldPassword,
      newPassword,
      schoolId,
      roleName,
    });

  clearAllCookies(res);
  setAllCookies(res, accessToken, refreshToken, csrfToken);

  res.json({ message });
});

const handleGetAccountDetail = asyncHandler(async (req, res) => {
  const { id: userId, roleId, schoolId, staticRoleId } = req.user;
  const response = await processGetAccountDetail({
    userId,
    roleId,
    schoolId,
    staticRoleId,
  });
  res.json(response);
});

module.exports = {
  handlePasswordChange,
  handleGetAccountDetail,
};
