import asyncHandler from 'express-async-handler';
import {
  processBookDemo,
  processUpdateDemoDetail,
  processUpdateDemoDateTime,
  processInviteUser,
  processApproveDirectAccessRequest,
  processDenyDirectAccessRequest,
  processConfirmInvite,
  processRequestAcountSetupAccess_temp
} from './demo-service.js';

export const handleBookDemo = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processBookDemo(payload);
  res.json(response);
});

export const handleRequestAcountSetupAccess = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processRequestAcountSetupAccess_temp(payload);
  res.json(response);
});

export const handleUpdateDemoDetail = asyncHandler(async (req, res) => {
  const payload = req.body;
  const { id: demoId } = req.params;
  const response = await processUpdateDemoDetail({ ...payload, demoId });
  res.json(response);
});

export const handleUpdateDemoDateTime = asyncHandler(async (req, res) => {
  const { dateTime } = req.body;
  const { id: demoId } = req.params;
  const response = await processUpdateDemoDateTime({ dateTime, demoId });
  res.json(response);
});

export const handleInviteUser = asyncHandler(async (req, res) => {
  const { id: demoId } = req.params;
  const response = await processInviteUser(demoId);
  res.json(response);
});

export const handleApproveAccessRequest = asyncHandler(async (req, res) => {
  const { id: demoId } = req.params;
  const response = await processApproveDirectAccessRequest(demoId);
  res.json(response);
});

export const handleDenyAccessRequest = asyncHandler(async (req, res) => {
  const { id: demoId } = req.params;
  const response = await processDenyDirectAccessRequest(demoId);
  res.json(response);
});

export const handleConfirmInvite = asyncHandler(async (req, res) => {
  const { demoId } = req.user;
  const response = await processConfirmInvite(demoId);
  res.json(response);
});
