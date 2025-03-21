const { db } = require("../../config");
const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  addRole,
  getRoles,
  updateRoleStatus,
  updateRole,
  getRolePermissions,
  getRoleUsers,
  assignPermissionsForRole,
  getStaticRoleIdById,
  deletePermissionsOfRole,
} = require("./role-repository");

const processAddRole = async (payload) => {
  const affectedRow = await addRole(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add role");
  }
  return { message: "Role added successfully" };
};

const processGetRoles = async (schoolId) => {
  const roles = await getRoles(schoolId);
  if (!Array.isArray(roles) || roles.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { roles };
};

const processUpdateRole = async (payload) => {
  const affectedRow = await updateRole(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update role");
  }
  return { message: "Role updated successfully" };
};

const processUpdateRoleStatus = async (payload) => {
  const affectedRow = await updateRoleStatus(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update role status");
  }
  return { message: `Role status updated successfully` };
};

const processAssignPermissionsForRole = async (payload) => {
  const affectedRow = await await assignPermissionsForRole(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to assign permissions to given role");
  }
  return { message: "Permissions assigned for given role successfully" };
};

const processGetRolePermissions = async (payload) => {
  const permissions = await getRolePermissions(payload);
  if (permissions.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }

  return { permissions };
};

const processGetRoleUsers = async (payload) => {
  const users = await getRoleUsers(payload);
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { users };
};

const processDeletePermissionsOfRole = async (payload) => {
  const affectedRow = await deletePermissionsOfRole(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete permissions for given role");
  }
  return { message: "Permissions deleted for given role successfully" };
};

module.exports = {
  processAddRole,
  processGetRoles,
  processUpdateRole,
  processUpdateRoleStatus,
  processAssignPermissionsForRole,
  processGetRolePermissions,
  processGetRoleUsers,
  processDeletePermissionsOfRole,
};
