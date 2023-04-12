const allowedOrigin = require('../Config/allowedOrigin');
const credentals = (req,res,next) => {
    const origin = req.headers.origin;
    if(allowedOrigin.includes(origin)){
      res.headers('Access-Control-Allow-Credentials',true);
    }
    next();
}
module.exports = credentals