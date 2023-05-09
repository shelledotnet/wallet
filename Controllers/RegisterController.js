//#region dependency
const  User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");
const {
  HTTP_STATUS_CODE,
  HTTP_STATUS_DESCRIPTION,
  ErrorResponse,
} = require("../Global");
const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");
const serialize = require("serialize-javascript");
const { v4: uuid } = require("uuid");
const audEvents = require("../middleware/auditLogs");

//#endregion

//#region  Actionmethod
const handleNewUser = async (req, res) => {
  const guid = uuid();
  const { user, email, pwd } = req.body;
  //evaluate right propereties are passed
     const errors = validationResult(req);
   if (!errors.isEmpty()) {
       await audEvents(
         `BAD_REQUEST:${req.method}\t${serialize(errors)}\t${
           req.baseUrl + req.url
         }`,
         "Log",
         guid
       );
  
     return res
       .status(StatusCodes.BAD_REQUEST)
       .json({
      errors: errors.array() ,
      code: StatusCodes.BAD_REQUEST,
      success: false,
      ref: guid
    });
   }

  if (!user || !pwd || !email)
    return res.status(StatusCodes.BAD_REQUEST).json({
      data: HTTP_STATUS_DESCRIPTION.BAD_REQUEST,
      code: StatusCodes.BAD_REQUEST,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  //evaluate user check for duplicate username in the DB
   const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate)
    return res.status(StatusCodes.CONFLICT).json({
      data: HTTP_STATUS_DESCRIPTION.CONFLICT,
      code: StatusCodes.CONFLICT,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  //evaluate password
   try{
       //encrypt pwd
       const hashedPwd = await bcrypt.hash(pwd,10);
       //store the new user
       const result = await User.create({
         username: user,
         // "roles":{"User":2001},role willl be created by default on user model creation
         email:email,
         password: hashedPwd,
       });
       
       console.log(result);
       if(result){
       return res.status(StatusCodes.CREATED).json({
         data: HTTP_STATUS_DESCRIPTION.CREATED,
         code: StatusCodes.CREATED,
         success: HTTP_STATUS_DESCRIPTION.TRUE,
         message: HTTP_STATUS_DESCRIPTION.SUCCESS,
         ref: guid
       });
      }
      else{
        return res.status(StatusCodes.BAD_REQUEST).json({
          data: HTTP_STATUS_DESCRIPTION.BAD_REQUEST,
          code: StatusCodes.BAD_REQUEST,
          success: HTTP_STATUS_DESCRIPTION.FALSE,
          message: HTTP_STATUS_DESCRIPTION.FAIL,
          ref: guid,
        });
      }
   }catch(err){
     ErrorResponse(err, res);
   }
};
//#endregion
module.exports = { handleNewUser };
