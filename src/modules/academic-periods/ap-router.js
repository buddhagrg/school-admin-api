const express = require("express");
const router = express.Router();
const apController = require("./ap-controller");

router.post("", apController.handleAddPeriod);
router.put("/:id", apController.handleUpdatePeriod);
router.delete("/:id", apController.handleDeletePeriod);
router.get("", apController.handleGetAllPeriods);
router.post("/dates", apController.handleAssignPeriodDates);
router.post("/:id/manage-order", apController.handleUpdatePeriodOrder);

module.exports = { academicPeriodRoutes: router };
