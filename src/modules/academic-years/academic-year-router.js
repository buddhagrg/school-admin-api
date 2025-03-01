const router = require("express").Router();
const { checkApiAccess } = require("../../middlewares");
const academicYearController = require("./academic-year-controller");

router.get(
  "",
  checkApiAccess,
  academicYearController.handleGetAllAcademicYears
);
router.post("", checkApiAccess, academicYearController.handleAddAcademicYear);
router.put(
  "/:id",
  checkApiAccess,
  academicYearController.handleUpdatelAcademicYear
);
router.patch(
  "/:id/activate",
  checkApiAccess,
  academicYearController.handleActivateAcademicYear
);

module.exports = { academicYearRoutes: router };
