const { v4: uuid } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const router = require("express").Router();

router.get("/test", (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'user test is successful',
    code: StatusCodes.OK,
    success: true,
    ref: uuid(),
  });
});
router.post("/login", (req, res) => {
  //throw Exception
  const username = req.body.username;//const{user,pwd}=req.body;
  console.log(req.body); 
  return res.status(StatusCodes.OK).json({
    data: `user is ${username}`,
    code: StatusCodes.OK,
    success: true,
    ref: uuid(),
  });
});
module.exports = router;
