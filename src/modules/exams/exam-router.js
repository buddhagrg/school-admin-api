const express = require("express");
const router = express.Router();
const examController = require("./exam-controller");

router.get("", examController.handleGetAllExamNames);
router.post("", examController.handleAddExamName);
router.put("/:id", examController.handleUpdateExamName);
router.delete("/:id", examController.handleDeleteExamName);

router.get("/routine", examController.handleGetExamRoutine);

router.get("/detail", examController.handleGetExamDetail);
router.post("/detail", examController.handleAddExamDetail);
router.put("/detail", examController.handleUpdateExamDetail);

router.get("/marks", examController.handleGetMarks);
router.post("/marks", examController.handleAddMarks);
router.put("/marks", examController.handleUpdateMarks);

router.post("/marksheet", examController.handleGetExamMarksheet);

module.exports = { examRoutes: router };
