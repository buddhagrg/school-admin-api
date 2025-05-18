import asyncHandler from 'express-async-handler';
import {
  processAddFee,
  processUpdateFee,
  processGetFeesAssignedToStudent,
  processAssignFeeToStudent,
  processDeleteFeeAssignedToStudent,
  processGetAllFees,
  processGetAllFeeStructures,
  processAddOrUpdateFeeStructures
} from './fee-service.js';

export const handleAddFee = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddFee({ ...payload, schoolId });
  res.json(response);
});

export const handleUpdateFee = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: feeId } = req.params;
  const payload = req.body;
  const response = await processUpdateFee({ ...payload, schoolId, feeId });
  res.json(response);
});

export const handleGetAllFees = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllFees(schoolId);
  res.json(response);
});

export const handleGetAllFeeStructures = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { classId, sectionId } = req.query;
  const response = await processGetAllFeeStructures({
    schoolId,
    classId,
    sectionId
  });
  res.json(response);
});

export const handleAddOrUpdateFeeStructures = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: classId } = req.params;
  const payload = req.body;
  const response = await processAddOrUpdateFeeStructures({
    ...payload,
    schoolId,
    classId
  });
  res.json(response);
});

export const handleGetFeesAssignedToStudent = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { studentId } = req.params;
  const response = await processGetFeesAssignedToStudent({
    schoolId,
    studentId
  });
  res.json(response);
});

export const handleAssignFeeToStudent = asyncHandler(async (req, res) => {
  const { schoolId, id: initiator } = req.user;
  const { studentId } = req.params;
  const { feeDetails } = req.body;
  const response = await processAssignFeeToStudent({
    schoolId,
    studentId,
    feeDetails,
    initiator
  });
  res.json(response);
});

export const handleDeleteFeeAssignedToStudent = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.params;
  const response = await processDeleteFeeAssignedToStudent({
    ...payload,
    schoolId
  });
  res.json(response);
});
