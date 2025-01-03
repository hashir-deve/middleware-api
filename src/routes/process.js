
const { Router } = require("express");
const { ProcessController } = require("../controllers/processController");

const router = new Router();

router.get("/process", ProcessController.getProcess);
router.post("/process", ProcessController.createProcess);
router.delete("/process/:id", ProcessController.deleteProcess)

module.exports = { router };