const express = require("express");
const router = express.Router();
const request = require('../helpers/validateRequest')
const handler = require("../handler/auth.handler")
const auth = require("../middleware/jwt.middleware")

router.post("/login", handler.validate("login"), request.validate, handler.loginUser);
router.post("/register", handler.validate("register"), request.validate, handler.register);
router.post("/refresh-token", handler.validate("refreshToken"), request.validate, auth.authenticateRefreshToken, handler.refresToken);


module.exports = router