import {
  ApiError,
  getAccessItemHierarchy,
  formatMyPermission,
  assertRowCount,
  handleArryResponse
} from '../../utils/index.js';
import {
  getAllPermissions,
  getMyPermissions,
  addPermission,
  updatePermission,
  deletePermission
} from './permission-repository.js';
import { PERMISSION_MESSAGES } from './permission-messages.js';

export const processGetAllPermissions = async (staticRole) => {
  return handleArryResponse(() => getAllPermissions(staticRole), 'permissions', getAccessItemHierarchy);
};

export const processGetMyPermissions = async (payload) => {
  const permissions = await getMyPermissions(payload);
  if (permissions.length <= 0) {
    throw new ApiError(404, PERMISSION_MESSAGES.NO_MY_PERMISSION);
  }
  const { hierarchialMenus, apis, uis } = formatMyPermission(permissions);
  return {
    menus: hierarchialMenus,
    apis,
    uis
  };
};

export const processAddPermission = async (payload) => {
  await assertRowCount(addPermission(payload), PERMISSION_MESSAGES.ADD_PERMISSION_FAIL);
  return { message: PERMISSION_MESSAGES.ADD_PERMISSION_SUCCESS };
};

export const processUpdatePermission = async (payload) => {
  await assertRowCount(updatePermission(payload), PERMISSION_MESSAGES.UPDATE_PERMISSION_FAIL);
  return { message: PERMISSION_MESSAGES.UPDATE_PERMISSION_SUCCESS };
};

export const processDeletePermission = async (id) => {
  await assertRowCount(deletePermission(id), PERMISSION_MESSAGES.DELETE_PERMISSION_FAIL);
  return { message: PERMISSION_MESSAGES.DELETE_PERMISSION_SUCCESS };
};
