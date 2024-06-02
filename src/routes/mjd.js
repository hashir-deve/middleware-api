
const { Router } = require("express");
const { MJDController } = require("../controllers/mjdController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/create-customer", verifyToken, MJDController.createCustomerDigicash);
router.post("/api/v2.0/mjd/customers", verifyToken, MJDController.createDynamicsCustomer);
router.patch("/api/v2.0/mjd/customers(:id)", verifyToken, MJDController.updateDynamicsCustomer);
router.get("/api/v2.0/mjd/customers(:id)", verifyToken, MJDController.getDynamicsCustomer);
router.get("/api/v2.0/mjd/customers/id(:number)", verifyToken, MJDController.getDynamicsCustomerId)
router.post("/api/v2.0/mjd/salesInvoices", verifyToken, MJDController.createSalesInvoice);
router.patch("/api/v2.0/mjd/salesInvoices(:id)", verifyToken, MJDController.updateSalesInvoice);
router.get("/api/v2.0/mjd/salesInvoices(:id)", verifyToken, MJDController.getSalesInvoice);

module.exports = { router };