import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  getRoles,
  updateRole,
  addRole,
  updateRoleStatus,
  saveRolePermissions,
  getRolePermissions,
  getRoleUsers
} from './role-repository.js';

export const processAddRole = async (payload) => {
  const affectedRow = await addRole(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add role');
  }
  return { message: 'Role added successfully' };
};

export const processGetRoles = async (schoolId) => {
  const roles = await getRoles(schoolId);
  if (!Array.isArray(roles) || roles.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { roles };
};

export const processUpdateRole = async (payload) => {
  const affectedRow = await updateRole(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update role');
  }
  return { message: 'Role updated successfully' };
};

export const processUpdateRoleStatus = async (payload) => {
  const affectedRow = await updateRoleStatus(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update role status');
  }
  return { message: `Role status updated successfully` };
};

export const processSaveRolePermissions = async (payload) => {
  const result = await saveRolePermissions(payload);
  if (!result || !result.status) {
    throw new ApiError(500, result.message);
  }
  return { message: result.message };
};

export const processGetRolePermissions = async (payload) => {
  const permissions = await getRolePermissions(payload);
  if (permissions.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { permissions };
};

export const processGetRoleUsers = async (payload) => {
  const users = await getRoleUsers(payload);
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { users };
};
