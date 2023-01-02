const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
  getAllPosts,
  createNewPost,
  getPostById,
} = require("../Controllers/FeedPostController");


router
  .route("/")
  .get(getAllPosts)
  .post(
    [
      check("title")
        .exists()
        .withMessage("title required")
        .notEmpty()
        .withMessage("title is empty"),
      check("body")
        .exists()
        .withMessage("body required")
        .notEmpty()
        .withMessage("body is empty")
    
    ],
    createNewPost
  );

router
  .route("/:id")
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
    getPostById
  );

module.exports = router;
