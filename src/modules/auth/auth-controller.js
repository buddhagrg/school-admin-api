import asyncHandler from 'express-async-handler';
import { UAParser } from 'ua-parser-js';
import {
  login,
  logout,
  getNewAccessAndCsrfToken,
  processAccountEmailVerify,
  processPasswordSetup,
  processResendEmailVerification,
  processResendPwdSetupLink,
  processPwdReset,
  processSetupSchoolProfile,
  processSetupAdminProfile
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
  const { id: userId } = req.user;
  const response = await processAccountEmailVerify(userId);
  res.json(response);
});

export const handleAccountPasswordSetup = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { email, password } = req.body;
  const response = await processPasswordSetup({ userId, email, password });
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

export const handlePwdReset = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const response = await processPwdReset(userId);
  res.json(response);
});

export const handleSetupSchoolProfile = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processSetupSchoolProfile(payload);
  res.json(response);
});

export const handleSetupAdminProfile = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processSetupAdminProfile(payload);
  res.json(response);
});
