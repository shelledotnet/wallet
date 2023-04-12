const auditLogs = require("./auditLogs");
const { StatusCodes } = require("http-status-codes");
const serialize = require("serialize-javascript");
const {v4:uuid}=require('uuid');
const errorHandler=(err,req,res,next)=>{
  let guid = uuid();
   auditLogs(
     `Request:${req.method}\tHeader:${serialize(req.headers)}\tBody${serialize(
       req.body
     )}\t ${
       req.baseUrl + req.url
     } \tUNCAUGTH_LEAK_SERVER_ERROR_index.js(app.use(errorHandler)):${serialize(
       err
     )}`,
     "Log",
     guid
   );
 res
   .status(StatusCodes.INTERNAL_SERVER_ERROR)
   .send({
     code: StatusCodes.INTERNAL_SERVER_ERROR,
     description:`issue completing request-${err.message}`,
     message:'failed',
     correlationId: guid
   });
}

module.exports=errorHandler;