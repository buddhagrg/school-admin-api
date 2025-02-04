const router = require("express").Router();
const levelController = require("./level-controller");

router.get("", levelController.handleGetLevels);
router.post("", levelController.handleAddLevel);
router.put("/:id", levelController.handleUpdateLevel);
router.delete("/:id", levelController.handleDeleteLevel);
router.post("/:id/add-class", levelController.handleAddClassToLevel);

module.exports = { academicLevelRoutes: router };
