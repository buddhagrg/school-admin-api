const { env } = require("./config");

const cookieOptions = {
    secure: true,
    sameSite: "lax",
    domain: env.cookieDomain
};

const setAccessTokenCookie = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: env.jwtAccessTokenTimeInMS,
        ...cookieOptions
    });
}
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: env.jwtRefreshTokenTimeInMS,
        ...cookieOptions
    });
}
const setCsrfTokenCookie = (res, csrfToken) => {
    res.cookie("csrfToken", csrfToken, {
        httpOnly: false,
        maxAge: env.csrfTokenTimeInMS,
        ...cookieOptions
    });
}
const setAllCookies = (res, accessToken, refreshToken, csrfToken) => {
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
    setCsrfTokenCookie(res, csrfToken);
}

const clearAllCookies = (res) => {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("csrfToken", cookieOptions);
}

module.exports = {
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setCsrfTokenCookie,
    setAllCookies,
    clearAllCookies
};
