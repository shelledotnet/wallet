const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const logOutController = require("../Controllers/LogOutContrroller");

router.get("/", logOutController.handleRefereshTokenLogOut);
module.exports = router;
