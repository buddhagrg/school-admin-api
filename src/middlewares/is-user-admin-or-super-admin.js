import { ApiError } from '../utils/index.js';

export const isUserAdminOrSuperAdmin = (allowedRoles) => (req, res, next) => {
  const { staticRole } = req.user;
  if (!allowedRoles.includes(staticRole)) {
    throw new ApiError(403, 'You do not have permission to this resource');
  }
  next();
};
