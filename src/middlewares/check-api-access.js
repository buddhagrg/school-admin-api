const expressAsyncHandler = require("express-async-handler");
const { checkPermission } = require("../modules/roles-and-permissions/rp-repository");
const { ApiError } = require("../utils");

const checkApiAccess = expressAsyncHandler(async (req, res, next) => {
    const { originalUrl, method } = req;
    const { roleId } = req.user;

    if (roleId !== 1) {
        const affectedRow = await checkPermission(roleId, originalUrl, method);
        if (affectedRow <= 0) {
            throw new ApiError(403, "You do not have permission to access to this resource.");
        }
    }
    next();
});

module.exports = { checkApiAccess };
