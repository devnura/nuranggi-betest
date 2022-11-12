const express = require("express");
const router = express.Router();
const request = require('../helpers/validateRequest')
const handler = require("../handler/auth.handler")
const auth = require("../middleware/jwt.middleware")

router.post("/login",auth.isAuthenticate, handler.validate("login"), request.validate, handler.loginUser);
router.get("/validate-token",auth.isAuthenticate, request.validate, handler.validateToken);
router.post("/register",auth.isAuthenticate, handler.validate("register"), request.validate, handler.register);
router.post("/refresh-token",auth.isAuthenticate, handler.validate("refreshToken"), request.validate, auth.authenticateRefreshToken, handler.refresToken);
router.get("/logout",auth.isAuthenticate, request.validate, auth.authenticateToken, handler.logout);


module.exports = router