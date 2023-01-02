const {v4:uuid}=require('uuid');

const requestHeader=(req,res,next)=>{
    req.header('ProductId',uuid())
    req.header('ClientId')
    req.header('X-correlationId',uuid())
    req.header('Content-Type','application/json')
    next();  //pasing to the next middlewaer
  }

  
  module.exports=requestHeader;