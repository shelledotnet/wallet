const logEvents=require('./logEvents');
const serialize = require('serialize-javascript')
const {v4:uuid}=require('uuid');

const auditLog=(req,res,next)=>{
    logEvents(
      `Request:${req.method}\t${serialize(req.body)}\t${req.url}\t${serialize(
        res.body
      )}`,
      "Log",
      "auditLog.txt",
      uuid()
    );
    next();
}

module.exports=auditLog;