
const { Router } = require("express");
const { MJDSalesInvoiceLinersController } = require("../controllers/mjdSalesInvoiceLinesController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/api/v2.0/mjd/salesInvoiceLines", verifyToken, MJDSalesInvoiceLinersController.createSalesInvoiceLines);
router.patch("/api/v2.0/mjd/salesInvoiceLines(:id)", verifyToken, MJDSalesInvoiceLinersController.updateSalesInvoiceLines);
router.get("/api/v2.0/mjd/salesInvoiceLines(:id)", verifyToken, MJDSalesInvoiceLinersController.getSalesInvoiceLines);

module.exports = { router };