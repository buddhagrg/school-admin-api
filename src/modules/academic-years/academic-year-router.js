const router = require("express").Router();
const academicYearController = require("./academic-year-controller");

router.get("", academicYearController.handleGetAllAcademicYears);
router.post("", academicYearController.handleAddAcademicYear);
router.put("/:id", academicYearController.handleUpdatelAcademicYear);
router.post("/:id/activate", academicYearController.handleActivateAcademicYear);

module.exports = { academicYearRoutes: router };
