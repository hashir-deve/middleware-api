
const { Router } = require("express");
const { MJDItemsController } = require("../controllers/mjdItemsController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/api/v2.0/mjd/items", verifyToken, MJDItemsController.createItems);
router.patch("/api/v2.0/mjd/items(:id)", verifyToken, MJDItemsController.updateItems);
router.get("/api/v2.0/mjd/items(:id)", verifyToken, MJDItemsController.getItems);

module.exports = { router };