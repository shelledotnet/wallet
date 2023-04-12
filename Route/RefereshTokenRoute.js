const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const refershTokenController = require("../Controllers/RefreshTokenController");

router.get(
  "/",
  refershTokenController.handleRefreshToken
);
module.exports = router;
