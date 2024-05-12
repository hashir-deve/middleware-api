
const { Router } = require("express");
const { ListenerController } = require("../controllers/listenerController");

const router = new Router();

router.post("/listener", ListenerController.processRequest);

module.exports = { router };