const express = require("express");
const router = express.Router();
const classController = require("./class-controller");
const { checkApiAccess } = require("../../middlewares");

router.get("", checkApiAccess, classController.handleFetchAllClasses);
router.get(
  "/structure",
  checkApiAccess,
  classController.handleGetClassStructure
);
router.post("", checkApiAccess, classController.handleAddClass);
router.put("/:id", checkApiAccess, classController.handleUpdateClass);
router.post(
  "/:id/deactivate",
  checkApiAccess,
  classController.handleUpdateClassStatus
);
router.post(
  "/:id/activate",
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
router.post(
  "/:id/sections/:sectionId/deactivate",
  checkApiAccess,
  classController.handleUpdateSectionStatus
);
router.post(
  "/:id/sections/:sectionId/activate",
  checkApiAccess,
  classController.handleUpdateSectionStatus
);

//class-teacher
router.post(
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
  "/teachers",
  checkApiAccess,
  classController.handleDeleteClassTeacher
);

module.exports = { classRoutes: router };
