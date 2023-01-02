const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
  getAllApple,
  CreateStudent,
  getStudentById,
  sendMail,
} = require("../Controllers/AppleController");

router.get("/", getAllApple);
router.post(
  "/",
  [
    check("title")
      .exists()
      .withMessage("title required")
      .notEmpty()
      .withMessage("title is empty"),
    check("band")
      .exists()
      .withMessage("band required")
      .notEmpty()
      .withMessage("band is empty"),
    check("venue")
      .exists()
      .withMessage("venue required")
      .notEmpty()
      .withMessage("venue is empty"),
    check("price")
      .exists()
      .withMessage("price required")
      .notEmpty()
      .withMessage("price is empty")
      .isDecimal()
      .withMessage("price should be number"),
  ],

  CreateStudent
);
router.get(
  "/:id",
  [
    check("id")
      .exists()
      .withMessage("id required")
      .notEmpty()
      .withMessage("id is empty")
      .isNumeric()
      .withMessage("id should be number"),
  ],
  getStudentById
);
router.get("/mail", sendMail);
module.exports = router;
