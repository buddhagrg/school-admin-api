import { env } from './config/index.js';

const cookieOptions = {
  secure: true,
  sameSite: 'lax',
  domain: env.COOKIE_DOMAIN
};

export const setAccessTokenCookie = (res, accessToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: env.JWT_ACCESS_TOKEN_TIME_IN_MS,
    ...cookieOptions
  });
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: env.JWT_REFRESH_TOKEN_TIME_IN_MS,
    ...cookieOptions
  });
};

export const setCsrfTokenCookie = (res, csrfToken) => {
  res.cookie('csrfToken', csrfToken, {
    httpOnly: false,
    maxAge: env.CSRF_TOKEN_TIME_IN_MS,
    ...cookieOptions
  });
};

export const setAllCookies = (res, accessToken, refreshToken, csrfToken) => {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
  setCsrfTokenCookie(res, csrfToken);
};

export const clearAllCookies = (res) => {
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('csrfToken', cookieOptions);
};
