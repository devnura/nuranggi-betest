const express = require("express");
const router = express.Router();
const request = require('../helpers/validateRequest')
const handler = require("../handler/auth.handler")

router.post("/login", handler.validate("login"), request.validate, handler.loginUser);
router.post("/register", handler.validate("login"), request.validate, handler.loginUser);
router.post("/refres-token", handler.validate("login"), request.validate, handler.loginUser);


module.exports = router