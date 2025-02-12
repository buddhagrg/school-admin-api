const router = require("express").Router();
const levelController = require("./level-controller");

router.get("", levelController.handleGetLevels);
router.post("", levelController.handleAddLevel);
router.put("/:id", levelController.handleUpdateLevel);
router.delete("/:id", levelController.handleDeleteLevel);

router.post("/:id/classes/:classId", levelController.handleAddClassToLevel);
router.get("/classes", levelController.handleGetLevelsWithClasses);
router.delete("/classes/:id", levelController.handleDeleteLevelFromClass);

module.exports = { academicLevelRoutes: router };
