const {
  ApiError,
  getAccessItemHierarchy,
  formatMyPermission,
} = require("../../utils");
const {
  getAllAccessControls,
  getMyAccessControl,
} = require("./access-control-repository");

const processGetAllAccessControls = async (staticRoleId) => {
  const accessControls = await getAllAccessControls(staticRoleId);
  if (accessControls.length <= 0) {
    throw new ApiError(404, "Access controls not found");
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

module.exports = {
  processGetAllAccessControls,
  processGetMyAccessControl,
};
