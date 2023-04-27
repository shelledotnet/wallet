//#region 
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { HTTP_STATUS_CODE, HTTP_STATUS_DESCRIPTION } = require("../Global");
const { StatusCodes } = require("http-status-codes");
const { v4: uuid } = require("uuid");
//#endregion
//#region Resources
const verifyJWT = (req,res,next) => { //do ensure your middlwear always as next params
    const guid = uuid();
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer '))
    return res.status(StatusCodes.UNAUTHORIZED).json({
      data: HTTP_STATUS_DESCRIPTION.UNAUTHORIZED,
      code: StatusCodes.UNAUTHORIZED,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        //a call back function return
        (err,decoded)=>{ 
            if(err)
            return res.status(StatusCodes.FORBIDDEN).json({
              data: HTTP_STATUS_DESCRIPTION.FORBIDDEN,
              code: StatusCodes.FORBIDDEN,
              success: HTTP_STATUS_DESCRIPTION.FALSE,
              message:  err.message,
              ref: guid,
            });
            //the valid response as the payload of the user in the token when decoded
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            req.currentUser = decoded;
            console.log(
              `checking the loged in user ${JSON.stringify(decoded)}`
            );
            next(); //this pass the function to the next middlewear/function
        }
        
        );

}
module.exports = verifyJWT;
//#endregion