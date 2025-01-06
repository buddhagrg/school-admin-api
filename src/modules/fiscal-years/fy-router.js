const router = require("express").Router();
const fyController = require("./fy-controller");

router.get("", fyController.handleGetAllFiscalYears);
router.post("", fyController.handleAddFiscalYear);
router.put("/:id", fyController.handleUpdateFiscalYear);
router.post("/:id/activate", fyController.handleActivateFiscalYear);

module.exports = { fiscalYearRoutes: router };
