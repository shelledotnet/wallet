const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const registerController = require('../Controllers/RegisterController');

router.post(
  "/",
  [
    check("user")
      .exists()
      .withMessage("user required")
      .notEmpty()
      .withMessage("user is empty")
      .isAlphanumeric()
      .withMessage("allow only alphabet and number"),
    check("pwd")
      .exists()
      .withMessage("pwd required")
      .notEmpty()
      .withMessage("pwd is empty")
      .isAlphanumeric()
      .withMessage("allow only alphabet and number"),
    check("email")
      .exists()
      .withMessage("email required")
      .notEmpty()
      .withMessage("email is empty")
      .isEmail()
      .withMessage("invalid character for email")
  ],
  registerController.handleNewUser
);
module.exports = router;