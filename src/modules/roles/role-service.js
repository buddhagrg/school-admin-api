import { assertFunctionResult, assertRowCount, handleArryResponse } from '../../utils/index.js';
import {
  getRoles,
  updateRole,
  addRole,
  updateRoleStatus,
  saveRolePermissions,
  getRolePermissions,
  getRoleUsers
} from './role-repository.js';
import { ROLE_MESSAGES } from './role-messages.js';

export const processGetRoles = async (schoolId) => {
  return handleArryResponse(() => getRoles(schoolId), 'roles');
};

export const processAddRole = async (payload) => {
  await assertRowCount(addRole(payload), ROLE_MESSAGES.ADD_ROLE_FAIL);
  return { message: ROLE_MESSAGES.ADD_ROLE_SUCCESS };
};

export const processUpdateRole = async (payload) => {
  await assertRowCount(updateRole(payload), ROLE_MESSAGES.UPDATE_ROLE_FAIL);
  return { message: ROLE_MESSAGES.UPDATE_ROLE_SUCCESS };
};

export const processUpdateRoleStatus = async (payload) => {
  await assertRowCount(updateRoleStatus(payload), ROLE_MESSAGES.UPDATE_ROLE_STATUS_FAIL);
  return { message: ROLE_MESSAGES.UPDATE_ROLE_STATUS_SUCCESS };
};

export const processSaveRolePermissions = async (payload) => {
  const result = await assertFunctionResult(saveRolePermissions(payload));
  return { message: result.message };
};

export const processGetRolePermissions = async (payload) => {
  return handleArryResponse(() => getRolePermissions(payload), 'permissions');
};

export const processGetRoleUsers = async (payload) => {
  return handleArryResponse(() => getRoleUsers(payload), 'users');
};
