
const { Router } = require("express");
const { MJDJournalLinesController } = require("../controllers/mjdJournalLinesController");
const verifyToken = require('../middlewares/authMiddlware');

const router = new Router();

router.post("/api/v2.0/mjd/journalLines", verifyToken, MJDJournalLinesController.createJournalLines);
router.patch("/api/v2.0/mjd/journalLines(:id)", verifyToken, MJDJournalLinesController.updateJournalLines);
router.get("/api/v2.0/mjd/journalLines(:id)", verifyToken, MJDJournalLinesController.getJournalLines);

module.exports = { router };