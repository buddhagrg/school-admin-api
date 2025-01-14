const { ERROR_MESSAGES } = require("../../constants");
const { ApiError } = require("../../utils");
const {
  getAllDepartments,
  addNewDepartment,
  getDepartmentById,
  updateDepartmentById,
  deleteDepartmentById,
} = require("./department-repository");

const processGetAllDepartments = async (schoolId) => {
  const departments = await getAllDepartments(schoolId);
  if (departments.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return { departments };
};

const processAddNewDepartment = async (payload) => {
  const affectedRow = await addNewDepartment(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to add new department");
  }
  return { message: "Department added successfully" };
};

const processGetDepartmentById = async (payload) => {
  const department = await getDepartmentById(payload);
  if (!department) {
    throw new ApiError(404, ERROR_MESSAGES.RECORD_NOT_FOUND);
  }
  return department;
};

const processUpdateDepartmentById = async (payload) => {
  const affectedRow = await updateDepartmentById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to update department detail");
  }
  return { message: "Department updated successfully" };
};

const processDeleteDepartmentById = async (payload) => {
  const affectedRow = await deleteDepartmentById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, "Unable to delete department detail");
  }
  return { message: "Department deleted successfully" };
};
module.exports = {
  processGetAllDepartments,
  processGetDepartmentById,
  processUpdateDepartmentById,
  processDeleteDepartmentById,
  processAddNewDepartment,
};
