import asyncHandler from 'express-async-handler';
import {
  processGetRoles,
  processAddRole,
  processUpdateRole,
  processUpdateRoleStatus,
  processSaveRolePermissions,
  processGetRolePermissions,
  processGetRoleUsers
} from './role-service.js';

export const handleGetRoles = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetRoles(schoolId);
  res.json(response);
});

export const handleAddRole = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processAddRole({ name, schoolId });
  res.json(response);
});

export const handleUpdateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateRole({ id, name, schoolId, status });
  res.json(response);
});

export const handleUpdateRoleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateRoleStatus({ id, status, schoolId });
  res.json(response);
});

export const handleSaveRolePermissions = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { permissions } = req.body;
  const { schoolId } = req.user;
  const response = await processSaveRolePermissions({
    roleId,
    permissions,
    schoolId
  });
  res.json(response);
});

export const handleGetRolePermissions = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { schoolId } = req.user;
  const response = await processGetRolePermissions({ roleId, schoolId });
  res.json(response);
});

export const handleGetRoleUsers = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const { schoolId } = req.user;
  const response = await processGetRoleUsers({ roleId, schoolId });
  res.json(response);
});
