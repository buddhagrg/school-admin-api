const asyncHandler = require("express-async-handler");
const { login, logout, getNewAccessAndCsrfToken, processAccountEmailVerify, processPasswordSetup } = require("./auth-service");
const { setAccessTokenCookie, setCsrfTokenCookie, setAllCookies, clearAllCookies } = require("../../cookie");

const handleLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const { accessToken, refreshToken, csrfToken, accountBasic } = await login(username, password);

    clearAllCookies(res);
    setAllCookies(res, accessToken, refreshToken, csrfToken);

    res.json(accountBasic);
});

const handleLogout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    const message = await logout(refreshToken);
    clearAllCookies(res);

    res.json(message);
});

const handleTokenRefresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    const { accessToken, csrfToken, message } = await getNewAccessAndCsrfToken(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("csrfToken");

    setAccessTokenCookie(res, accessToken);
    setCsrfTokenCookie(res, csrfToken);

    res.json(message);
});

const handleAccountEmailVerify = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const message = await processAccountEmailVerify(id);
    res.json(message);
});

const handleAccountPasswordSetup = asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const { username: userEmail, password } = req.body;
    const message = await processPasswordSetup({ userId, userEmail, password });
    res.json(message);
});

module.exports = {
    handleLogin,
    handleLogout,
    handleTokenRefresh,
    handleAccountEmailVerify,
    handleAccountPasswordSetup
};
