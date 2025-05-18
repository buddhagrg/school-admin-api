import asyncHandler from 'express-async-handler';
import { processPasswordChange } from './account-service.js';
import { setAllCookies, clearAllCookies } from '../../cookie.js';
import { processGetStudentDetail } from '../students/student-service.js';
import { processGetStaffDetail } from '../staff/staff-service.js';

export const handlePasswordChange = asyncHandler(async (req, res) => {
  const { newPassword, currentPassword } = req.body;
  const { id: userId, schoolId, role: roleName } = req.user;
  const { accessToken, refreshToken, csrfToken, message } = await processPasswordChange({
    userId,
    currentPassword,
    newPassword,
    schoolId,
    roleName
  });
  clearAllCookies(res);
  setAllCookies(res, accessToken, refreshToken, csrfToken);
  res.json({ message });
});

export const handleGetAccountDetail = asyncHandler(async (req, res) => {
  const { mode } = req.query;
  const { id: userId, schoolId, staticRole } = req.user;
  const payload = { schoolId, mode, userId };
  const response =
    staticRole === 'STUDENT'
      ? await processGetStudentDetail(payload)
      : await processGetStaffDetail(payload);
  res.json(response);
});
