//#region dependency
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isJwtExpired = require("jwt-check-expiration");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");
const { HTTP_STATUS_CODE, HTTP_STATUS_DESCRIPTION } = require("../Global");
const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");
const serialize = require("serialize-javascript");
const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
const date = require("date-and-time");
const audEvents = require("../middleware/auditLogs");

//#endregion

//#region  Actionmethod
const handleRefereshTokenLogOut = async (req, res) => {
  //on client side also delete accesstoken
  // we can only delete refeshtoken from the backend
  //on client side endeavore to delete the accessToken as well, which is not possible from the backend
  const guid = uuid();
  const cookies = req.cookies;
  //check if cookies exist and if jwt is in the cookies (optional chaining operator ?)
  //please not we have already declared jwt property holds referhstoken value
  if (!cookies?.jwt)
    //this ok
    return res.status(StatusCodes.NO_CONTENT).json({
      data: HTTP_STATUS_DESCRIPTION.NO_CONTENT,
      code: StatusCodes.NO_CONTENT,
      success: HTTP_STATUS_DESCRIPTION.TRUE,
      message: HTTP_STATUS_DESCRIPTION.SUCCESS,
      ref: guid,
    });
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  //evaluate refreshtTokin because its safe in the DB.. we cant do this for accesstoken becose is not save anywhere
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //on production include --> secure: true -- only serves on https
    return res.status(StatusCodes.NO_CONTENT).json({
      data: HTTP_STATUS_DESCRIPTION.NO_CONTENT,
      code: StatusCodes.NO_CONTENT,
      success: HTTP_STATUS_DESCRIPTION.TRUE,
      message: HTTP_STATUS_DESCRIPTION.SUCCESS,
      ref: guid,
    });
  }

  //Delete refereshToken in the DB
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);
  
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //on production include --> secure: true -- only serves on https
  return res.status(StatusCodes.NO_CONTENT).json({
    data: HTTP_STATUS_DESCRIPTION.NO_CONTENT,
    code: StatusCodes.NO_CONTENT,
    success: HTTP_STATUS_DESCRIPTION.TRUE,
    message: HTTP_STATUS_DESCRIPTION.SUCCESS,
    ref: guid,
  });
};
//#endregion
module.exports = { handleRefereshTokenLogOut };
