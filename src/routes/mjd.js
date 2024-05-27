
const { Router } = require("express");
const { MJDController } = require("../controllers/mjdController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/create-customer", verifyToken, MJDController.createCustomerDigicash);
router.post("/api/v2.0/mjd/customers", verifyToken, MJDController.createDynamicsCustomer);
router.patch("/api/v2.0/mjd/customers(:id)", verifyToken, MJDController.updateDynamicsCustomer);
router.get("/api/v2.0/mjd/customers(:id)", verifyToken, MJDController.getDynamicsCustomer);

module.exports = { router };