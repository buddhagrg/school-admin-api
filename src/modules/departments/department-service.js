import { assertRowCount, handleArryResponse } from '../../utils/index.js';
import {
  getAllDepartments,
  addNewDepartment,
  updateDepartmentById,
  deleteDepartmentById
} from './department-repository.js';
import { DEPARTMENT_MESSAGES } from './department-messages.js';

export const processAddNewDepartment = async (payload) => {
  await assertRowCount(addNewDepartment(payload), DEPARTMENT_MESSAGES.ADD_DEPARTMENT_FAIL);
  return { message: DEPARTMENT_MESSAGES.ADD_DEPARTMENT_SUCCESS };
};

export const processUpdateDepartmentById = async (payload) => {
  await assertRowCount(updateDepartmentById(payload), DEPARTMENT_MESSAGES.UPDATE_DEPARTMENT_FAIL);
  return { message: DEPARTMENT_MESSAGES.UPDATE_DEPARTMENT_SUCCESS };
};

export const processDeleteDepartmentById = async (payload) => {
  await assertRowCount(deleteDepartmentById(payload), DEPARTMENT_MESSAGES.DELETE_DEPARTMENT_FAIL);
  return { message: DEPARTMENT_MESSAGES.DELETE_DEPARTMENT_SUCCESS };
};

export const processGetAllDepartments = async (schoolId) => {
  return handleArryResponse(() => getAllDepartments(schoolId), 'departments');
};
