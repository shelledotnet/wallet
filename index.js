//#region dependency
require("dotenv").config(); //accessing the environment variables
const express = require("express");
const PORT = process.env.PORT || 4500;
const app = express();
const cors = require("cors");
const default404 = require("./middleware/default404");
const errorHandler = require("./middleware/errorHandler");
const auditLog = require("./middleware/auditLog");
const requestHeader = require("./requestHeader");
const responseHeader = require("./responseHeader");
const logger = require("./logger");
const chalk = require("chalk");
const morgan = require("morgan");
const feedPostRoute = require("./Route/FeedPostRoute");
const studentRoute = require("./Route/StudentRoute");
const appleRoute = require("./Route/AppleRoute");
//#endregion

//#region  Miidlewear-ActionMethod
app.use(express.json());
app.use(morgan("tiny"));
app.use([requestHeader, responseHeader, logger]);
app.use("/api/v1/students", studentRoute);
app.use("/api/v1/feeds", feedPostRoute);
app.use("/api/v1/apples", appleRoute);

app.use(default404);

app.use(errorHandler);
//#endregion


  app.listen(PORT, () =>
    console.log(chalk.redBright(`server running  at ${PORT}...`))
  );

