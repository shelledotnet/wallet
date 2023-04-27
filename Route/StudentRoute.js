const express=require('express')
const { check} = require("express-validator");
const router=express.Router();
const {
  getAllStudent,
  createStudent,
  getcurrentuser,
  createStudent_raw,
  getTodoId_Raw,
  getStudentById,
  getAllStudent_Raw,
  getStudentById_Raw,
  deleteStudentById_Raw,
  sendMail,
  fetchApi
} = require("../Controllers/StudentController");
const roles = require('../Config/roles_list');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require("../middleware/verifyRoles");

router.get("/currentuser", verifyJWT,verifyRoles(roles.Admin,roles.Editor), getcurrentuser);
router.get("/raw/mysql", verifyJWT, getAllStudent_Raw);
router.route("/")
      .get(getAllStudent)
      .post(
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
      .withMessage("price should be number")
  ],

  createStudent_raw
);
router.route("/:id")
  .get(
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
  )
  .delete(
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
router.post("/call-api", fetchApi);
router.get("/current-user", verifyJWT, getcurrentuser);
module.exports=router;