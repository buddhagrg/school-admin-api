const { ERROR_MESSAGES } = require("../../constants");
const {
  ApiError,
  getAccessItemHierarchy,
  formatMyPermission,
} = require("../../utils");
const {
  getAllAccessControls,
  getMyAccessControl,
  addAccessControl,
  updateAccessControl,
  deleteAccessControl,
} = require("./access-control-repository");

const processGetAllAccessControls = async (staticRoleId) => {
  const accessControls = await getAllAccessControls(staticRoleId);
  if (accessControls.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }

  const hierarchialAccessControls = getAccessItemHierarchy(accessControls);
  return hierarchialAccessControls;
};

const processGetMyAccessControl = async (payload) => {
  const permissions = await getMyAccessControl(payload);
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

const processAddAccessControl = async (payload) => {
  const affectedRow = await addAccessControl(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add access control");
  }

  return { message: "New access control added successfully" };
};

const processUpdateAccessControl = async (payload) => {
  const affectedRow = await updateAccessControl(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update access control");
  }

  return { message: "Access control updated successfully" };
};

const processDeleteAccessControl = async (id) => {
  const affectedRow = await deleteAccessControl(id);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unabe to delete access control");
  }

  return { message: "Access control deleted successfully" };
};

module.exports = {
  processGetAllAccessControls,
  processGetMyAccessControl,
  processAddAccessControl,
  processUpdateAccessControl,
  processDeleteAccessControl,
};
