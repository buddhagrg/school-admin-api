import asyncHandler from 'express-async-handler';
import {
  processGetAllDepartments,
  processAddNewDepartment,
  processUpdateDepartmentById,
  processDeleteDepartmentById
} from './department-service.js';

export const handleGetAllDepartments = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllDepartments(schoolId);
  res.json(response);
});

export const handleAddNewDepartment = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processAddNewDepartment({ name, schoolId });
  res.json(response);
});

export const handleUpdateDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { schoolId } = req.user;
  const response = await processUpdateDepartmentById({ id, name, schoolId });
  res.json(response);
});

export const handleDeleteDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { schoolId } = req.user;
  const response = await processDeleteDepartmentById({ id, schoolId });
  res.json(response);
});
