const express = require("express");
const router = express.Router();
const adminController = require("./admin-controller");
const {
  handleGetAllAccessControls,
} = require("../access-control/access-control-controller");

router.post("/schools", adminController.handleAddSchool);
router.put("/schools/:id", adminController.handleUpdateSchool);
router.get("/schools", adminController.handleGetAllSchools);
router.get("/schools/:id", adminController.handleGetSchool);
router.delete("/schools/:id", adminController.handleDeleteSchool);

router.get("/access-controls", handleGetAllAccessControls);
router.post("/access-controls", adminController.handleAddAccessControl);
router.put("/access-controls/:id", adminController.handleUpdateAccessControl);
router.delete(
  "/access-controls/:id",
  adminController.handleDeleteAccessControl
);

module.exports = { adminRoutes: router };
