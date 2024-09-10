
const { Router } = require("express");
const { LoginController } = require("../controllers/loginController.js");

const router = new Router();

router.post("/login", LoginController.loginHandler);

module.exports = { router };