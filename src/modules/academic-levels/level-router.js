const router = require("express").Router();
const levelController = require("./level-controller");

router.get("", levelController.handleGetLevels);
router.post("", levelController.handleAddLevel);
router.put("/:id", levelController.handleUpdateLevel);
router.post("/:id/add-class", levelController.handleAddClassToLevel);
router.get("/periods", levelController.handleGetAcademicLevelsWithPeriods);

module.exports = { academicLevelRoutes: router };
