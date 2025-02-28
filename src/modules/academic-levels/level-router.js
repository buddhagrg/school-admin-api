const router = require("express").Router();
const { checkApiAccess } = require("../../middlewares");
const levelController = require("./level-controller");

router.get(
  "/periods",
  checkApiAccess,
  levelController.handleGetAcademicLevelsWithPeriods
);
router.get("", checkApiAccess, levelController.handleGetLevels);
router.post("", checkApiAccess, levelController.handleAddLevel);
router.put("/:id", checkApiAccess, levelController.handleUpdateLevel);
router.delete("/:id", checkApiAccess, levelController.handleDeleteLevel);

router.get(
  "/classes",
  checkApiAccess,
  levelController.handleGetLevelsWithClasses
);
router.put(
  "/:id/classes",
  checkApiAccess,
  levelController.handleAddClassToLevel
);
router.delete(
  "/classes/:id",
  checkApiAccess,
  levelController.handleDeleteLevelFromClass
);

router.get(
  "/:id/periods/dates",
  checkApiAccess,
  levelController.handleGetPeriodsDates
);
router.put(
  "/:id/periods/dates",
  checkApiAccess,
  levelController.handleUpdatePeriodsDates
);
router.post(
  "/:id/periods/reorder",
  checkApiAccess,
  levelController.handleReorderPeriods
);

module.exports = { academicLevelRoutes: router };
