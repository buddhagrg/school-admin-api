const { ERROR_MESSAGES } = require("../../constants");
const {
  ApiError,
  getAccessItemHierarchy,
  formatMyPermission,
} = require("../../utils");
const {
  getAllPermissions,
  getMyPermissions,
  addPermission,
  updatePermission,
  deletePermission,
} = require("./permission-repository");

const processGetAllPermissions = async (staticRoleId) => {
  const data = await getAllPermissions(staticRoleId);
  if (!data || data.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  const permissions = getAccessItemHierarchy(data);
  return { permissions };
};

const processGetMyPermissions = async (payload) => {
  const permissions = await getMyPermissions(payload);
  if (permissions.length <= 0) {
    throw new ApiError(404, "You do not have permission to the system.");
  }
  const { hierarchialMenus, apis, uis } = formatMyPermission(permissions);
  return {
    menus: hierarchialMenus,
    apis,
    uis,
  };
};

const processAddPermission = async (payload) => {
  const affectedRow = await addPermission(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add access control");
  }

  return { message: "New access control added successfully" };
};

const processUpdatePermission = async (payload) => {
  const affectedRow = await updatePermission(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update access control");
  }

  return { message: "Access control updated successfully" };
};

const processDeletePermission = async (id) => {
  const affectedRow = await deletePermission(id);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unabe to delete access control");
  }

  return { message: "Access control deleted successfully" };
};

module.exports = {
  processGetAllPermissions,
  processGetMyPermissions,
  processAddPermission,
  processUpdatePermission,
  processDeletePermission,
};
