const {v4:uuid}=require('uuid');

const responseHeader=(req,res,next)=>{
    res.header('ProductId',req.headers.productid || uuid())
    res.header('ClientId',req.headers.clientid || 456)
    res.header('X-correlationId',req.headers.correlationid || uuid())
    res.header('Content-Type','application/json')
    next();  //pasing to the next middlewaer
  }

  
  module.exports=responseHeader;