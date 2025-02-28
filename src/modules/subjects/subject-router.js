const express = require("express");
const router = express.Router();
const subjectController = require("./subject-controller");
const { checkApiAccess } = require("../../middlewares");

router.post("", checkApiAccess, subjectController.handleAddSubject);
router.get("", checkApiAccess, subjectController.handleGetAllSubjects);
router.put("", checkApiAccess, subjectController.handleUpdateSubject);
router.delete("", checkApiAccess, subjectController.handleDeleteSubject);

module.exports = { subjectRoutes: router };
