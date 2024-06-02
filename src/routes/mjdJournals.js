
const { Router } = require("express");
const { MJDJournalsController } = require("../controllers/mjdJournalsController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/api/v2.0/mjd/journals", verifyToken, MJDJournalsController.createJournals);
router.patch("/api/v2.0/mjd/journals(:id)", verifyToken, MJDJournalsController.updateJournals);
router.get("/api/v2.0/mjd/journals(:id)", verifyToken, MJDJournalsController.getJournals);

module.exports = { router };