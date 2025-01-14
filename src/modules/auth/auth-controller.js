const asyncHandler = require("express-async-handler");
const {
  login,
  logout,
  getNewAccessAndCsrfToken,
  processAccountEmailVerify,
  processPasswordSetup,
  processResendEmailVerification,
  processResendPwdSetupLink,
  processPwdReset,
  processSetupSchoolProfile,
  processSetupAdminProfile,
} = require("./auth-service");
const {
  setAccessTokenCookie,
  setCsrfTokenCookie,
  setAllCookies,
  clearAllCookies,
} = require("../../cookie");

const handleLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const {
    accessToken,
    refreshToken,
    csrfToken,
    accountBasic: response,
  } = await login(username, password);

  clearAllCookies(res);
  setAllCookies(res, accessToken, refreshToken, csrfToken);

  res.json(response);
});

const handleLogout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const message = await logout(refreshToken);
  clearAllCookies(res);

  res.status(204).json(message);
});

const handleTokenRefresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const {
    accessToken,
    csrfToken,
    message: response,
  } = await getNewAccessAndCsrfToken(refreshToken);
  res.clearCookie("accessToken");
  res.clearCookie("csrfToken");

  setAccessTokenCookie(res, accessToken);
  setCsrfTokenCookie(res, csrfToken);

  res.json(response);
});

const handleAccountEmailVerify = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const response = await processAccountEmailVerify(userId);
  res.json(response);
});

const handleAccountPasswordSetup = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { username: userEmail, password } = req.body;
  const response = await processPasswordSetup({ userId, userEmail, password });
  res.json(response);
});

const handleResendEmailVerification = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const response = await processResendEmailVerification(userId);
  res.json(response);
});

const handleResendPwdSetupLink = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const response = await processResendPwdSetupLink(userId);
  res.json(response);
});

const handlePwdReset = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const response = await processPwdReset(userId);
  res.json(response);
});

const handleSetupSchoolProfile = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processSetupSchoolProfile(payload);
  res.json(response);
});

const handleSetupAdminProfile = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processSetupAdminProfile(payload);
  res.json(response);
});

module.exports = {
  handleLogin,
  handleLogout,
  handleTokenRefresh,
  handleAccountEmailVerify,
  handleAccountPasswordSetup,
  handleResendEmailVerification,
  handleResendPwdSetupLink,
  handlePwdReset,
  handleSetupSchoolProfile,
  handleSetupAdminProfile,
};
