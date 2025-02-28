const express = require("express");
const router = express.Router();
const examController = require("./exam-controller");
const { checkApiAccess } = require("../../middlewares");

router.get("", checkApiAccess, examController.handleGetAllExamNames);
router.post("", checkApiAccess, examController.handleAddExamName);
router.put("/:id", checkApiAccess, examController.handleUpdateExamName);
router.delete("/:id", checkApiAccess, examController.handleDeleteExamName);

router.get("/routine", checkApiAccess, examController.handleGetExamRoutine);

router.get("/detail", checkApiAccess, examController.handleGetExamDetail);
router.post("/detail", checkApiAccess, examController.handleAddExamDetail);
router.put("/detail", checkApiAccess, examController.handleUpdateExamDetail);

router.get("/marks", checkApiAccess, examController.handleGetMarks);
router.post("/marks", checkApiAccess, examController.handleAddMarks);
router.put("/marks", checkApiAccess, examController.handleUpdateMarks);

router.post(
  "/marksheet",
  checkApiAccess,
  examController.handleGetExamMarksheet
);

module.exports = { examRoutes: router };
