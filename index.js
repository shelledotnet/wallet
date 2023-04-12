//#region dependency
require("dotenv").config(); //accessing the environment variables
const express = require("express");
const PORT = process.env.PORT || 4500;
const app = express();
const cors = require("cors");
const corsOptions = require("./Config/corsOptions");
const credential = require("./middleware/credential");
const default404 = require("./middleware/default404");
const errorHandler = require("./middleware/errorHandler");
const auditLog = require("./middleware/auditLog");
const requestHeader = require("./requestHeader");
const responseHeader = require("./responseHeader");
const logger = require("./logger");
const chalk = require("chalk");
const morgan = require("morgan");
const cookieParsal = require('cookie-parser')
const feedPostRoute = require("./Route/FeedPostRoute");
const studentRoute = require("./Route/StudentRoute");
const registerRoute = require("./Route/RegisterRoute");
const authRoute = require("./Route/authRoute");
const refershRoute = require("./Route/RefereshTokenRoute");
const logOutRoute = require("./Route/LogOutRoute");
const appleRoute = require("./Route/AppleRoute");
//#endregion 

//#region  Middlewear-ActionMethod
//custom middlewear logger
app.use([requestHeader, responseHeader, logger]);

//Handle options credentials check - before CORS!
//and fetch cookies credential requirement
app.use(credential);

//Cross Origin Resource sharing
app.use(cors(corsOptions));


//built in middlewear to handle urlencoded data e.g formdata: 'content-type:application/x-www-form-urlencoded'
app.use(express.urlencoded({extended:false}))

//built in middlewear for json
app.use(express.json());

//middlewear for cookie to enable retrive refershToken in the res.cookies
app.use(cookieParsal())

app.use(morgan("tiny"));

app.use("/api/v1/students", studentRoute);
app.use("/api/v1/register", registerRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/refresh", refershRoute);
app.use("/api/v1/logout", logOutRoute);
app.use("/api/v1/feeds", feedPostRoute);
app.use("/api/v1/apples", appleRoute);

app.use(default404);

app.use(errorHandler);
//#endregion


  app.listen(PORT, () =>
    console.log(chalk.redBright(`server running  at ${PORT}...`))
  );

