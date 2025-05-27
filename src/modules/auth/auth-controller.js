import asyncHandler from 'express-async-handler';
import { UAParser } from 'ua-parser-js';
import {
  login,
  logout,
  getNewAccessAndCsrfToken,
  processAccountEmailVerify,
  processResendEmailVerification,
  processResendPwdSetupLink,
  processRequestPwdReset,
  processPwdReset,
  processSetupPassword
} from './auth-service.js';
import {
  setAccessTokenCookie,
  setCsrfTokenCookie,
  setAllCookies,
  clearAllCookies
} from '../../cookie.js';

export const handleLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const parser = new UAParser();
  const ua = req.headers['user-agent'];
  const {
    browser: { name: browserName },
    os: { name: osName }
  } = parser.setUA(ua).getResult();
  const recentDeviceInfo = `${browserName} on ${osName}`;
  const {
    accessToken,
    refreshToken,
    csrfToken,
    accountBasic: response
  } = await login(email, password, recentDeviceInfo);
  clearAllCookies(res);
  setAllCookies(res, accessToken, refreshToken, csrfToken);
  res.json(response);
});

export const handleLogout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const message = await logout(refreshToken);
  clearAllCookies(res);
  res.status(204).json(message);
});

export const handleTokenRefresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const {
    accessToken,
    csrfToken,
    message: response
  } = await getNewAccessAndCsrfToken(refreshToken);
  res.clearCookie('accessToken');
  res.clearCookie('csrfToken');
  setAccessTokenCookie(res, accessToken);
  setCsrfTokenCookie(res, csrfToken);
  res.json(response);
});

export const handleAccountEmailVerify = asyncHandler(async (req, res) => {
  const { identifier, purpose, resetKey } = req.user;
  const response = await processAccountEmailVerify({ identifier, purpose, resetKey });
  res.json(response);
});

export const handleResendEmailVerification = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const response = await processResendEmailVerification(userId);
  res.json(response);
});

export const handleResendPwdSetupLink = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const response = await processResendPwdSetupLink(userId);
  res.json(response);
});

export const handleRequestPwdReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const response = await processRequestPwdReset(email);
  res.json(response);
});

export const handlePwdReset = asyncHandler(async (req, res) => {
  const { identifier, purpose, resetKey } = req.user;
  const { password } = req.body;
  const response = await processPwdReset({ identifier, purpose, resetKey, password });
  res.json(response);
});

export const handleSetupPassword = asyncHandler(async (req, res) => {
  const { identifier, purpose, resetKey } = req.user;
  const { password } = req.body;
  const response = await processSetupPassword({ identifier, purpose, resetKey, password });
  res.json(response);
});
