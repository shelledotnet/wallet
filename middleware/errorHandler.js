const auditLogs = require("./auditLogs");
const { StatusCodes } = require("http-status-codes");
const serialize = require("serialize-javascript");
const {v4:uuid}=require('uuid');
const errorHandler=(err,req,res,next)=>{
  let guid = uuid();
   auditLogs(
     `Request:${req.method}\tHeader:${serialize(req.headers)}\tBody${serialize(
       req.body
     )}\t ${req.baseUrl + req.url} \tINTERNAL_SERVER_ERROR_message:${serialize(
       err
     )}`,
     "Log",
     guid
   );
 res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .send({
     code: StatusCodes.INTERNAL_SERVER_ERROR,
     description: "issue completing request",
     correlationId: guid
   });
}

module.exports=errorHandler;