const { ApiError } = require("../utils");

const isUserAdminOrSuperAdmin = (allowedRoles) => (req, res, next) => {
  const { staticRoleId } = req.user;
  if (!allowedRoles.includes(staticRoleId)) {
    throw new ApiError(403, "You do not have permission to this resource");
  }
  next();
};

module.exports = { isUserAdminOrSuperAdmin };
