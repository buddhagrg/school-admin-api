const asyncHandler = require("express-async-handler");
const { checkPermission } = require("../modules/roles/role-repository");
const { ApiError } = require("../utils");

const checkApiAccess = asyncHandler(async (req, res, next) => {
  const {
    baseUrl,
    route: { path },
    method,
  } = req;
  const { staticRoleId, roleId, id: userId, schoolId } = req.user;
  const originalUrl = baseUrl.startsWith("/")
    ? `${baseUrl.slice(1)}${path}`
    : `${baseUrl}${path}`;

  if (staticRoleId !== 2) {
    const affectedRow = await checkPermission(
      schoolId,
      roleId,
      originalUrl,
      method,
      userId
    );
    if (affectedRow <= 0) {
      throw new ApiError(
        403,
        `You do not have permission to access to this resource - ${originalUrl}`
      );
    }
  }
  next();
});

module.exports = { checkApiAccess };
