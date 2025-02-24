const express = require("express");
const router = express.Router();
const classController = require("./class-controller");
const { checkApiAccess } = require("../../middlewares");

router.get(
  "/sections",
  checkApiAccess,
  classController.handleGetClassesWithSections
);
router.get("", checkApiAccess, classController.handleFetchAllClasses);
router.post("", checkApiAccess, classController.handleAddClass);
router.put("/:id", checkApiAccess, classController.handleUpdateClass);
router.patch(
  "/:id/status",
  checkApiAccess,
  classController.handleUpdateClassStatus
);

//section
router.post("/:id/sections", checkApiAccess, classController.handleAddSection);
router.put(
  "/:id/sections/:sectionId",
  checkApiAccess,
  classController.handleUpdateSection
);
router.patch(
  "/:id/sections/:sectionId/status",
  checkApiAccess,
  classController.handleUpdateSectionStatus
);

//class-teacher
router.put(
  "/:id/teachers/:teacherId",
  checkApiAccess,
  classController.handleAssignClassTeacher
);
router.get(
  "/teachers",
  checkApiAccess,
  classController.handleGetAllClassTeachers
);
router.delete(
  "/teachers/:id",
  checkApiAccess,
  classController.handleDeleteClassTeacher
);

module.exports = { classRoutes: router };
