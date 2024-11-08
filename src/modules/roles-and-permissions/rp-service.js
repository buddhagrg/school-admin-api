const { db } = require("../../config");
const { ApiError } = require("../../utils");
const {
  insertRole,
  getRoles,
  getRoleDetail,
  enableOrDisableRoleStatusByRoleId,
  updateRoleById,
  getPermissionsById,
  getUsersByRoleId,
  getAccessControlByIds,
  insertPermissionForRoleId,
  switchUserRole,
  deletePermissionForRoleId,
  getStaticRoleIdById,
} = require("./rp-repository");

const checkIfRoleIdExist = async (id) => {
  const role = await getRoleDetail(id);
  if (!role) {
    throw new ApiError(404, "Invalid role id");
  }
};

const addRole = async ({ name, schoolId }) => {
  const affectedRow = await insertRole({ name, schoolId });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add role");
  }

  return { message: "Role added successfully" };
};

const fetchRoles = async (schoolId) => {
  const roles = await getRoles(schoolId);
  if (!Array.isArray(roles) || roles.length <= 0) {
    throw new ApiError(404, "Roles not found");
  }

  return roles;
};

const updateRole = async (payload) => {
  const affectedRow = await updateRoleById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update role");
  }

  return { message: "Role updated successfully" };
};

const processRoleStatus = async ({ id, status, schoolId }) => {
  await checkIfRoleIdExist(id);

  const affectedRow = await enableOrDisableRoleStatusByRoleId({
    id,
    status,
    schoolId,
  });
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to disable role");
  }

  const stsText = status ? "enabled" : "disabled";
  return { message: `Role ${stsText} successfully` };
};

const addRolePermission = async ({ roleId, permissions, schoolId }) => {
  await checkIfRoleIdExist(roleId);

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const idArray = permissions
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (idArray.length === 0) {
      await deletePermissionForRoleId({ roleId, schoolId, client });
      await client.query("COMMIT");
      return { message: "Permission of given role deleted successfully" };
    }
    const ids = idArray.map((id) => parseInt(id, 10));
    const accessControls = await getAccessControlByIds({ ids, client });

    if (accessControls.length > 0) {
      const queryParams = accessControls
        .map(({ id, type }) => `(${roleId}, ${id}, '${type}', '${schoolId}')`)
        .join(", ");
      await insertPermissionForRoleId({ queryParams, client });
    }

    await client.query("COMMIT");

    return { message: "Permission of given role saved successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new ApiError(500, "Unable to assign permission to given role");
  } finally {
    client.release();
  }
};

const getRolePermissions = async (roleId) => {
  const staticRoleId = await getStaticRoleIdById(roleId);
  if (!staticRoleId) {
    throw new ApiError(404, "Role does not exist");
  }

  const permissions = await getPermissionsById({ roleId, staticRoleId });
  if (permissions.length <= 0) {
    throw new ApiError(404, "Permissions for given role not found");
  }

  return permissions;
};

const fetchUsersByRoleId = async ({ roleId, schoolId }) => {
  await checkIfRoleIdExist(roleId);

  const users = await getUsersByRoleId({ roleId, schoolId });
  if (!Array.isArray(users) || users.length <= 0) {
    throw new ApiError(404, "Users not found");
  }

  return users;
};

const processSwitchRole = async (payload) => {
  const affectedRow = await switchUserRole(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to switch role");
  }
  return { message: "Role switched successfully" };
};

module.exports = {
  addRole,
  fetchRoles,
  updateRole,
  processRoleStatus,
  addRolePermission,
  getRolePermissions,
  fetchUsersByRoleId,
  processSwitchRole,
};
