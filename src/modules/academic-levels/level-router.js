const router = require("express").Router();
const levelController = require("./level-controller");

router.get("/periods", levelController.handleGetAcademicLevelsWithPeriods);
router.get("", levelController.handleGetLevels);
router.post("", levelController.handleAddLevel);
router.put("/:id", levelController.handleUpdateLevel);
router.delete("/:id", levelController.handleDeleteLevel);

router.get("/classes", levelController.handleGetLevelsWithClasses);
router.put("/:id/classes", levelController.handleAddClassToLevel);
router.delete("/classes/:id", levelController.handleDeleteLevelFromClass);

router.get("/:id/periods/dates", levelController.handleGetPeriodsDates);
router.post("/:id/periods/reorder", levelController.handleReorderPeriods);

module.exports = { academicLevelRoutes: router };
