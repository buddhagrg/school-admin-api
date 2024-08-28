const { env } = require("./config");

const setAccessTokenCookie = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: env.jwtAccessTokenTimeInMS,
        secure: true,
        sameSite: "lax"
    });
}
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: env.jwtRefreshTokenTimeInMS,
        secure: true,
        sameSite: "lax"
    });
}
const setCsrfTokenCookie = (res, csrfToken) => {
    res.cookie("csrfToken", csrfToken, {
        httpOnly: false,
        maxAge: env.csrfTokenTimeInMS,
        secure: true,
        sameSite: "lax"
    });
}
const setAllCookies = (res, accessToken, refreshToken, csrfToken) => {
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
    setCsrfTokenCookie(res, csrfToken);
}

const clearAllCookies = (res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");
}

module.exports = {
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setCsrfTokenCookie,
    setAllCookies,
    clearAllCookies
};
