
const { Router } = require("express");
const { ListenerController } = require("../controllers/listenerController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/listener", ListenerController.processRequest);
router.post("/create-customer", verifyToken, ListenerController.createCustomerDigicash);
router.post("/dynamics/create-customer", verifyToken, ListenerController.createDynamicsCustomer);

module.exports = { router };