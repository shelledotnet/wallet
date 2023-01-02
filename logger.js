//#region Logger
const logger=(req,res,next)=>{
    const method=req.method;
    const url=req.url;
    const user=req.user===undefined ? 'user: N/A':req.user;
    const body=req.body===undefined ? 'reqbody: N/A':req.body;
    const resBody=res.body===undefined ? 'resbody: N/A':res.body;
    const time=`date:${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}-${new Date().getHours()}:${new Date().getMinutes()}`;
    // console.log(user,method,body,url,resBody,time);
    next();  //pasing to the next middlewaer
  }
  //#endregion    

  module.exports=logger;