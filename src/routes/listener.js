
const { Router } = require("express");
const { ListenerController } = require("../controllers/listenerController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/listener", ListenerController.processRequest);
router.post("/create-customer", verifyToken, ListenerController.createCustomer);

module.exports = { router };