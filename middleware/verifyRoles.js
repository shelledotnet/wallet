require("dotenv").config();
const { HTTP_STATUS_CODE, HTTP_STATUS_DESCRIPTION } = require("../Global");
const { StatusCodes } = require("http-status-codes");
const { v4: uuid } = require("uuid");

const verifyRoles = (...allowedRoles) => {
  const guid = uuid();
  return (req,res,next) => {
    if (!req.roles) {
      return res.status(StatusCodes.FORBIDDEN).json({
        data: HTTP_STATUS_DESCRIPTION.FORBIDDEN,
        code: StatusCodes.FORBIDDEN,
        success: HTTP_STATUS_DESCRIPTION.FALSE,
        message: HTTP_STATUS_DESCRIPTION.FAIL,
        ref: guid,
      });
    }
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    if(!result){
         return res.status(StatusCodes.FORBIDDEN).json({
           data: HTTP_STATUS_DESCRIPTION.FORBIDDEN,
           code: StatusCodes.FORBIDDEN,
           success: HTTP_STATUS_DESCRIPTION.FALSE,
           message: HTTP_STATUS_DESCRIPTION.FAIL,
           ref: guid,
         });
    }
    next();
  }
};

module.exports = verifyRoles ;
