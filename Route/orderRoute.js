const express = require("express");
const router = express.Router();
router
  .route("/")
  .get((req, res) => {
    res.send("user test successfull");
  })
  .post((req, res) => {
    const { username } = req.body;
    console.log(username);
    res.send(`loving this ${username}`);
  });

module.exports = router;
