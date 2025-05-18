import asyncHandler from 'express-async-handler';
import { checkApiAccessOfRole } from '../modules/roles/role-repository.js';
import { ApiError } from '../utils/index.js';

export const checkApiAccess = asyncHandler(async (req, res, next) => {
  const {
    baseUrl,
    route: { path },
    method
  } = req;
  const { staticRole, roleId, id: userId, schoolId } = req.user;
  const originalUrl = baseUrl.startsWith('/') ? `${baseUrl.slice(1)}${path}` : `${baseUrl}${path}`;
  if (staticRole !== 'ADMIN') {
    const affectedRow = await checkApiAccessOfRole(schoolId, roleId, originalUrl, method, userId);
    if (affectedRow <= 0) {
      throw new ApiError(
        403,
        `You do not have permission to access to this resource - ${originalUrl}`
      );
    }
  }
  next();
});
