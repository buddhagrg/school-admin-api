const { ApiError } = require("../utils");

const checkRoleAccess = (roles) => (req, res, next) => {
    const { role } = req.user;

    if (roles.includes(role)) {
        next();
    } else {
        throw new ApiError(403, "Forbidden. You do not have permission to access to this resource.");
    }
}

module.exports = { checkRoleAccess };
