//#region dependency
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isJwtExpired = require('jwt-check-expiration');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path')
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
const handleLogin = async (req,res) => {
  const guid = uuid();
  const { user, pwd } = req.body;  //object destructuring
  //evaluate right propereties are passed for client side validastion
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await audEvents(
      `BAD_REQUEST:${req.method}\t${serialize(errors)}\t${
        req.baseUrl + req.url
      }`,
      "Log",
      guid
    );
    //but why are we logging remote client validation above any way its a good prctise
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: errors.array(),
      data: HTTP_STATUS_DESCRIPTION.BAD_REQUEST,
      code: StatusCodes.BAD_REQUEST,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  }
  //evaluate right propereties are passed below for server side validation
  if (!user || !pwd) {
    await audEvents(
      `BAD_REQUEST:${req.method}\t invalid user id or password\t${
        req.baseUrl + req.url
      }`,
      "Log",
      guid
    );
    return res.status(StatusCodes.BAD_REQUEST).json({
      data: HTTP_STATUS_DESCRIPTION.BAD_REQUEST,
      code: StatusCodes.BAD_REQUEST,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  }
  //evaluate user
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser){
    await audEvents(
      `UNAUTHORIZED:${req.method}\t invalid user or password\t${
        req.baseUrl + req.url
      }`,
      "Log",
      guid
    );
    return res.status(StatusCodes.UNAUTHORIZED).json({
      data: HTTP_STATUS_DESCRIPTION.UNAUTHORIZED,
      code: StatusCodes.UNAUTHORIZED,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  }
  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);

    //create jwt
    const accessToken = jwt.sign(
      //custome paylod -avoid passing sensitive data e.g password
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      //Generic payload
      { expiresIn: process.env.accessToken_LifeSpan } //accessToken is  shortlife on prod could be 5min-15mins depends on business requirement
      //on production include --> secure: true -- only serves on https
    );
    const refreshToken = jwt.sign(
      //custome paylod -avoid passing sensitive data e.g password
      //there is no need of sending roles in refereshToken
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      //optional Generic payload
      { expiresIn: process.env.refreshToken_LifeSpan } //refershToken is longlife
      //on production include --> secure: true -- only serves on https
    );
    //ensure to save refreshToken with current user in the DB-- that will allow us to create log out route-this will alow us to invalidate the refershToken when logout
    // isActive , ExpiredAt ,  CreatedDate
    //the refresh token should be stored in the memory (this is not vonerable) is not securd in the local storage
    //we also want to save our refershtoken in the DB and cokkies
    //By setting cokkies to HTTP only with this is not available to javascript ... is not vulnerable-- so we can save the refeshToken here in the cookies
    foundUser.refreshToken = refreshToken;
    foundUser.refreshTokenExpired = false;
    foundUser.refreshTokenActive = true;
    foundUser.refreshTokenExpiredDate = date.addMonths(new Date(), 5);
    const result = await foundUser.save();
    //console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000  
    }); //secure: true, include this in cookie object on prod
     //1Day
    

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
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      data: HTTP_STATUS_DESCRIPTION.UNAUTHORIZED,
      code: StatusCodes.UNAUTHORIZED,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  }
}
//#endregion
module.exports = { handleLogin};