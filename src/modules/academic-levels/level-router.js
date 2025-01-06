const router = require("express").Router();
const levelController = require("./level-controller");

router.get("", levelController.handleGetLevels);
router.post("", levelController.handleAddLevel);
router.put("/:id", levelController.handleUpdateLevel);

module.exports = { academicLevelRoutes: router };
