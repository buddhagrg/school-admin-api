const express = require("express");
const router = express.Router();
const apController = require("./ap-controller");
const { checkApiAccess } = require("../../middlewares");

router.post("", checkApiAccess, apController.handleAddPeriod);
router.put("/:id", checkApiAccess, apController.handleUpdatePeriod);
router.delete("/:id", checkApiAccess, apController.handleDeletePeriod);

module.exports = { academicPeriodRoutes: router };
