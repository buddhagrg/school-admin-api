const asyncHandler = require("express-async-handler");
const {
  processAddFee,
  processUpdateFee,
  processGetFeesAssignedToStudent,
  processAssignFeeToStudent,
  processDeleteFeeAssignedToStudent,
  processGetAllFees,
  processGetAllFeeStructures,
  processAddOrUpdateFeeStructures,
} = require("./fee-service");

const handleAddFee = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const response = await processAddFee({ ...payload, schoolId });
  res.json(response);
});

const handleUpdateFee = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: feeId } = req.params;
  const payload = req.body;
  const response = await processUpdateFee({ ...payload, schoolId, feeId });
  res.json(response);
});

const handleGetAllFees = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const response = await processGetAllFees(schoolId);
  res.json(response);
});

const handleGetAllFeeStructures = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { classId, sectionId } = req.query;
  const response = await processGetAllFeeStructures({
    schoolId,
    classId,
    sectionId,
  });
  res.json(response);
});

const handleAddOrUpdateFeeStructures = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: classId } = req.params;
  const payload = req.body;
  const response = await processAddOrUpdateFeeStructures({
    ...payload,
    schoolId,
    classId,
  });
  res.json(response);
});

const handleGetFeesAssignedToStudent = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { studentId } = req.params;
  const response = await processGetFeesAssignedToStudent({
    schoolId,
    studentId,
  });
  res.json(response);
});

const handleAssignFeeToStudent = asyncHandler(async (req, res) => {
  const { schoolId, id: initiator } = req.user;
  const { studentId } = req.params;
  const { feeDetails } = req.body;
  const response = await processAssignFeeToStudent({
    schoolId,
    studentId,
    feeDetails,
    initiator,
  });
  res.json(response);
});

const handleDeleteFeeAssignedToStudent = asyncHandler(
  async (req, res) => {
    const { schoolId } = req.user;
    const payload = req.params;
    const response = await processDeleteFeeAssignedToStudent({
      ...payload,
      schoolId,
    });
    res.json(response);
  }
);

module.exports = {
  handleAddFee,
  handleUpdateFee,
  handleGetAllFees,
  handleGetAllFeeStructures,
  handleAddOrUpdateFeeStructures,
  handleAssignFeeToStudent,
  handleGetFeesAssignedToStudent,
  handleDeleteFeeAssignedToStudent,
};
