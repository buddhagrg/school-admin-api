import asyncHandler from 'express-async-handler';
import {
  processGetAllPermissions,
  processGetMyPermissions,
  processAddPermission,
  processUpdatePermission,
  processDeletePermission
} from './permission-service.js';

export const handleGetAllPermissions = asyncHandler(async (req, res) => {
  const { staticRole } = req.user;
  const response = await processGetAllPermissions(staticRole);
  res.json(response);
});

export const handleGetMyPermissions = asyncHandler(async (req, res) => {
  const { roleId, staticRole, schoolId } = req.user;
  const response = await processGetMyPermissions({
    roleId,
    schoolId,
    staticRole
  });
  res.json(response);
});

export const handleAddPermission = asyncHandler(async (req, res) => {
  const payload = req.body;
  const response = await processAddPermission(payload);
  res.json(response);
});

export const handleUpdatePermission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const response = await processUpdatePermission({ ...payload, id });
  res.json(response);
});

export const handleDeletePermission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await processDeletePermission(id);
  res.json(response);
});
