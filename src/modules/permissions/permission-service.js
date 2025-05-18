import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError, getAccessItemHierarchy, formatMyPermission } from '../../utils/index.js';
import {
  getAllPermissions,
  getMyPermissions,
  addPermission,
  updatePermission,
  deletePermission
} from './permission-repository.js';

export const processGetAllPermissions = async (staticRole) => {
  const data = await getAllPermissions(staticRole);
  if (!data || data.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  const permissions = getAccessItemHierarchy(data);
  return { permissions };
};

export const processGetMyPermissions = async (payload) => {
  const permissions = await getMyPermissions(payload);
  if (permissions.length <= 0) {
    throw new ApiError(404, 'You do not have permission to the system.');
  }
  const { hierarchialMenus, apis, uis } = formatMyPermission(permissions);
  return {
    menus: hierarchialMenus,
    apis,
    uis
  };
};

export const processAddPermission = async (payload) => {
  const affectedRow = await addPermission(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add access control');
  }
  return { message: 'New access control added successfully' };
};

export const processUpdatePermission = async (payload) => {
  const affectedRow = await updatePermission(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update access control');
  }
  return { message: 'Access control updated successfully' };
};

export const processDeletePermission = async (id) => {
  const affectedRow = await deletePermission(id);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unabe to delete access control');
  }
  return { message: 'Access control deleted successfully' };
};
