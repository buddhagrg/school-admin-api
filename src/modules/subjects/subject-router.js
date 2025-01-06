const express = require("express");
const router = express.Router();
const subjectController = require("./subject-controller");

router.post("", subjectController.handleAddSubject);
router.get("", subjectController.handleGetAllSubjects);
router.put("", subjectController.handleUpdateSubject);
router.delete("", subjectController.handleDeleteSubject);

module.exports = { subjectRoutes: router };
