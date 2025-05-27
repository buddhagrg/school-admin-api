import asyncHandler from 'express-async-handler';
import { processVerifySystemAccess, processRequestSystemAccess } from './system-access-service.js';

export const handleRequestSystemAccess = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processRequestSystemAccess(payload);
  res.json(response);
});

export const handleVerifySystemAccess = asyncHandler(async (req, res) => {
  const { identifier, purpose, resetKey } = req.user;
  const response = await processVerifySystemAccess({ identifier, purpose, resetKey });
  res.json(response);
});
