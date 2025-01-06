const expressAsyncHandler = require("express-async-handler");
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

const handleAddFee = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const payload = req.body;
  const message = await processAddFee({ ...payload, schoolId });
  res.json(message);
});

const handleUpdateFee = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: feeId } = req.params;
  const payload = req.body;
  const message = await processUpdateFee({ ...payload, schoolId, feeId });
  res.json(message);
});

const handleGetAllFees = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const fee = await processGetAllFees(schoolId);
  res.json(fee);
});

const handleGetAllFeeStructures = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { classId, sectionId } = req.query;
  const data = await processGetAllFeeStructures({
    schoolId,
    classId,
    sectionId,
  });
  res.json({ data });
});

const handleAddOrUpdateFeeStructures = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id: classId } = req.params;
  const payload = req.body;
  const message = await processAddOrUpdateFeeStructures({
    ...payload,
    schoolId,
    classId,
  });
  res.json(message);
});

const handleGetFeesAssignedToStudent = expressAsyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { studentId } = req.params;
  const data = await processGetFeesAssignedToStudent({ schoolId, studentId });
  res.json({ data });
});

const handleAssignFeeToStudent = expressAsyncHandler(async (req, res) => {
  const { schoolId, id: initiator } = req.user;
  const { studentId } = req.params;
  const { feeDetails } = req.body;
  const message = await processAssignFeeToStudent({
    schoolId,
    studentId,
    feeDetails,
    initiator,
  });
  res.json(message);
});

const handleDeleteFeeAssignedToStudent = expressAsyncHandler(
  async (req, res) => {
    const { schoolId } = req.user;
    const payload = req.params;
    const message = await processDeleteFeeAssignedToStudent({
      ...payload,
      schoolId,
    });
    res.json(message);
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
