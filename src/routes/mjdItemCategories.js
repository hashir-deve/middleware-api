
const { Router } = require("express");
const { MJDItemCategoriesController } = require("../controllers/mjdItemCategoriesController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/api/v2.0/mjd/itemCategories", verifyToken, MJDItemCategoriesController.createItemCategories);
router.patch("/api/v2.0/mjd/itemCategories(:id)", verifyToken, MJDItemCategoriesController.updateItemCategories);
router.get("/api/v2.0/mjd/itemCategories(:id)", verifyToken, MJDItemCategoriesController.getItemCategories);

module.exports = { router };