const whiteList=require('./allowedOrigin');
const corsOptions={
    origin: (origin,callback)=>{
      //please remove this after develpment  || !origin (this allow loopback url access)
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Request  Not allowed by CORS"));
      }
    },
    optionsSuccessStatus:200
}
//Cross Origin Resource Sharing
module.exports=corsOptions;