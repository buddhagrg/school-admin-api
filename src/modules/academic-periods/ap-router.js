const express = require("express");
const router = express.Router();
const apController = require("./ap-controller");

router.post("", apController.handleAddPeriod);
router.put("", apController.handleUpdatePeriod);
router.delete("", apController.handleDeletePeriod);
router.get("", apController.handleGetAllPeriods);
router.post("/dates", apController.handleAssignPeriodDates);

module.exports = { academicPeriodRoutes: router };
