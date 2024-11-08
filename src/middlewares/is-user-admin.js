const { ApiError } = require("../utils");

const isUserAdmin = (req, res, next) => {
  const { staticRoleId } = req.user;
  if (staticRoleId !== 2) {
    throw new ApiError(403, "You do not have permission to this resource");
  }
  next();
};

module.exports = { isUserAdmin };
