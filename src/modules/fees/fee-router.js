const express = require("express");
const router = express.Router();
const feeController = require("./fee-controller");
const { checkApiAccess } = require("../../middlewares");

// fee types
router.get("", checkApiAccess, feeController.handleGetAllFees);
router.post("", checkApiAccess, feeController.handleAddFee);
router.put("", checkApiAccess, feeController.handleUpdateFee);

// fee structures
router.get("", checkApiAccess, feeController.handleGetAllFeeStructures);
router.post("", checkApiAccess, feeController.handleAddOrUpdateFeeStructures);

// fee actions
router.get(
  "/assign/:studentId",
  checkApiAccess,
  feeController.handleGetFeesAssignedToStudent
);
router.post(
  "/assign/:studentId",
  checkApiAccess,
  feeController.handleAssignFeeToStudent
);
router.delete(
  "/:id/unassign/:studentId",
  checkApiAccess,
  feeController.handleDeleteFeeAssignedToStudent
);

module.exports = { feeRoutes: router };
