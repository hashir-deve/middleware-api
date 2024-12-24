const { Router } = require("express");
const { MJDController } = require("../controllers/costdriverController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/costdriver", verifyToken, MJDController.createCostDrivers);

module.exports = { router };