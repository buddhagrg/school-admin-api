const router = require("express").Router();
const { checkApiAccess } = require("../../middlewares");
const fyController = require("./fy-controller");

router.get("", checkApiAccess, fyController.handleGetAllFiscalYears);
router.post("", checkApiAccess, fyController.handleAddFiscalYear);
router.put("/:id", checkApiAccess, fyController.handleUpdateFiscalYear);
router.patch(
  "/:id/activate",
  checkApiAccess,
  fyController.handleActivateFiscalYear
);

module.exports = { fiscalYearRoutes: router };
