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
const handleRefreshToken = async (req, res) => {
  const guid = uuid();
  const cookies = req.cookies;
  //check if cookies exist and if jwt property is in the cookies (optional chaining operator ?)
  if (!cookies?.jwt)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      data: HTTP_STATUS_DESCRIPTION.UNAUTHORIZED,
      code: StatusCodes.UNAUTHORIZED,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  //evaluate refreshtTokin because its safe in the DB.. we cant do this for token becose is not save anywhere
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser)
    return res.status(StatusCodes.FORBIDDEN).json({
      data: HTTP_STATUS_DESCRIPTION.FORBIDDEN,
      code: StatusCodes.FORBIDDEN,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  //verify refereshToken
  const roles = Object.values(foundUser.roles);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      //a call back function return
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
          return res.status(StatusCodes.FORBIDDEN).json({
            data: HTTP_STATUS_DESCRIPTION.FORBIDDEN,
            code: StatusCodes.FORBIDDEN,
            success: HTTP_STATUS_DESCRIPTION.FALSE,
            message: err.message,
            ref: guid,
          });
        //create jwt
        const accessToken = jwt.sign(
          //custome paylod -avoid passing sensitive data e.g password
          {
            UserInfo: {
              username: foundUser.username,
              roles: roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          //Generic payload
          { expiresIn: process.env.accessToken_LifeSpan } //accessToken is  shortlife on prod could be 5min-15mins depends on business requirement
        );
           return res.status(StatusCodes.OK).json({
             data: {
               accessToken,
               expiresIn: format(
                 date.addSeconds(
                   new Date(),
                   Number(process.env.accessToken_LifeSpan.substring(0, 2))
                 ),
                 "yyyyMMdd:HH:mm:ss"
               ),
             },
             code: StatusCodes.OK,
             success: HTTP_STATUS_DESCRIPTION.TRUE,
             message: HTTP_STATUS_DESCRIPTION.SUCCESS,
             ref: guid,
           });
       }
    );
  
 
};
//#endregion
module.exports = { handleRefreshToken };
