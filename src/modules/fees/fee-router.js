const express = require("express");
const router = express.Router();
const feeController = require("./fee-controller");

// fee types
router.get("", feeController.handleGetAllFees);
router.post("", feeController.handleAddFee);
router.put("", feeController.handleUpdateFee);

// fee structures
router.get("", feeController.handleGetAllFeeStructures);
router.post("", feeController.handleAddOrUpdateFeeStructures);

// fee actions
router.get("/assign/:studentId", feeController.handleGetFeesAssignedToStudent);
router.post("/assign/:studentId", feeController.handleAssignFeeToStudent);
router.delete(
  "/:id/unassign/:studentId",
  feeController.handleDeleteFeeAssignedToStudent
);

module.exports = { feeRoutes: router };
