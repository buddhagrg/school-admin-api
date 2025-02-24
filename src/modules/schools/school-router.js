const express = require("express");
const router = express.Router();
const schoolController = require("./school-controller");
const { isUserAdminOrSuperAdmin } = require("../../middlewares");

router.post("", isUserAdminOrSuperAdmin([1]), schoolController.handleAddSchool);
router.put(
  "/:id",
  isUserAdminOrSuperAdmin([1, 2]),
  schoolController.handleUpdateSchool
);
router.get(
  "",
  isUserAdminOrSuperAdmin([1]),
  schoolController.handleGetAllSchools
);
router.get(
  "/:id",
  isUserAdminOrSuperAdmin([1, 2]),
  schoolController.handleGetSchool
);
router.delete(
  "/:id",
  isUserAdminOrSuperAdmin([1]),
  schoolController.handleDeleteSchool
);

module.exports = { schoolRoutes: router };
