const express = require("express");
const router = express.Router();
const request = require('../helpers/validateRequest')
const handler = require("../handler/user.handler")

router.get("/", request.validate, handler.fetchAll);
router.get("/:id", handler.validate("checkId"), request.validate, handler.findById);
router.post("/", handler.validate("create"), request.validate, handler.createUser);
router.put("/:id", handler.validate("checkId"), request.validate, handler.validate("update"), request.validate, handler.updateUser);
router.delete("/:id", handler.validate("checkId"), request.validate, handler.deleteUser);

module.exports = router