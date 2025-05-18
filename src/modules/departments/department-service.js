import { ERROR_MESSAGES } from '../../constants/index.js';
import { ApiError } from '../../utils/index.js';
import {
  getAllDepartments,
  addNewDepartment,
  updateDepartmentById,
  deleteDepartmentById
} from './department-repository.js';

export const processGetAllDepartments = async (schoolId) => {
  const departments = await getAllDepartments(schoolId);
  if (departments.length <= 0) {
    throw new ApiError(404, ERROR_MESSAGES.DATA_NOT_FOUND);
  }
  return { departments };
};

export const processAddNewDepartment = async (payload) => {
  const affectedRow = await addNewDepartment(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to add new department');
  }
  return { message: 'Department added successfully' };
};

export const processUpdateDepartmentById = async (payload) => {
  const affectedRow = await updateDepartmentById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to update department detail');
  }
  return { message: 'Department updated successfully' };
};

export const processDeleteDepartmentById = async (payload) => {
  const affectedRow = await deleteDepartmentById(payload);
  if (affectedRow <= 0) {
    throw new ApiError(500, 'Unable to delete department detail');
  }
  return { message: 'Department deleted successfully' };
};
