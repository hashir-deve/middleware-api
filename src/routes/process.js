
const { Router } = require("express");
const { ProcessController } = require("../controllers/processController");

const router = new Router();

router.get("/process", ProcessController.getProcess);
router.post("/process", ProcessController.createProcess);

module.exports = { router };