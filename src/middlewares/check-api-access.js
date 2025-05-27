import asyncHandler from 'express-async-handler';
import { checkApiAccessOfRole } from '../modules/roles/role-repository.js';
import { assertRowCount } from '../utils/index.js';

export const checkApiAccess = asyncHandler(async (req, res, next) => {
  const {
    baseUrl,
    route: { path },
    method
  } = req;
  const { staticRole, roleId, userId, schoolId } = req.user;
  const originalUrl = baseUrl.startsWith('/') ? `${baseUrl.slice(1)}${path}` : `${baseUrl}${path}`;

  const NO_PERMISSIONS = `You do not have permission to access to this resource - ${originalUrl}`;
  if (staticRole !== 'ADMIN') {
    await assertRowCount(
      checkApiAccessOfRole(schoolId, roleId, originalUrl, method, userId),
      NO_PERMISSIONS,
      403
    );
  }
  next();
});
