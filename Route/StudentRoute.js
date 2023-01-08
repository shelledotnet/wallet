const express=require('express')
const { check} = require("express-validator");
const router=express.Router();
const {
  getAllStudent,
  createStudent,
  createStudent_raw,
  getTodoId_Raw,
  getStudentById,
  getAllStudent_Raw,
  getStudentById_Raw,
  deleteStudentById_Raw,
  sendMail,
} = require("../Controllers/StudentController");


router.get("/raw/mysql", getAllStudent_Raw);
router.get("/",getAllStudent);
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
      .withMessage("price should be number")
      
  ],

  createStudent
);
router.post(
  "/raw",
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

  createStudent_raw
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
router.get(
  "/storePro/:id",
  [
    check("id")
      .exists()
      .withMessage("id required")
      .notEmpty()
      .withMessage("id is empty"),
  ],
  getTodoId_Raw
);
router.delete(
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
  deleteStudentById_Raw
);
router.get(
  "/raw/:id",
  [
    check("id")
      .exists()
      .withMessage("id required")
      .notEmpty()
      .withMessage("id is empty")
      .isNumeric()
      .withMessage("id should be number"),
  ],
  getStudentById_Raw
);
router.get("/mail", sendMail);
module.exports=router;