//#region dependency
const router = require("express").Router();
const User = require("../models/UserModel");
const serialize = require("serialize-javascript");
const { check } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");
const {
  HTTP_STATUS_CODE,
  HTTP_STATUS_DESCRIPTION,
  ErrorResponse,
} = require("../Global");
const { v4: uuid } = require("uuid");
const audEvents = require("../middleware/auditLogs");
//#endregion

//#region REGISTER
router.post("/register",[
    check("username")
      .exists()
      .withMessage("user required")
      .notEmpty()
      .withMessage("user is empty")
      .isAlphanumeric()
      .withMessage("allow only alphabet and number"),
    check("password")
      .exists()
      .withMessage("pwd required")
      .notEmpty()
      .withMessage("pwd is empty")
      .isAlphanumeric()
      .withMessage("allow only alphabet and number"),
    check("email")
      .exists()
      .withMessage("email required")
      .notEmpty()
      .withMessage("email is empty")
      .isEmail()
      .withMessage("invalid character for email")
  ],async (req,res) => {
  const GUID = uuid();
  const { username, email, password } = req.body;
  //evaluate right propereties are passed
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await audEvents(
      `BAD_REQUEST:${req.method}\t${serialize(errors)}\t url:::${
        req.baseUrl + req.url
      }`,
      "Log",
      GUID
    );

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: errors.array(),
      code: StatusCodes.BAD_REQUEST,
      success: false,
      ref: GUID,
    });
  }
 
  try {
    //evaluate user check for duplicate username in the DB
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate)
      return res.status(StatusCodes.CONFLICT).json({
        data: HTTP_STATUS_DESCRIPTION.CONFLICT,
        code: StatusCodes.CONFLICT,
        success: HTTP_STATUS_DESCRIPTION.FALSE,
        message: HTTP_STATUS_DESCRIPTION.FAIL,
        ref: GUID,
      });
    await audEvents(
      `Request:${req.method}\tHeader:${serialize(req.headers)}\tBody${serialize(
        req.body
      )}\t url: ${req.headers.host + req.baseUrl + req.url}`,
      "Log",
      GUID
    );
    const newuser = new User({
      username: username,
      email: email,
      password: password //CryptoJS.AES.encrypt(password,process.env.PWD_SECRET).toString()
    });
    const savedUser = await newuser.save();
    console.log(savedUser);
    if (savedUser) {
        await audEvents(
          `Response:Body:${serialize(
            savedUser
          )}`,
          "Log",
          GUID
        );
      return res.status(StatusCodes.CREATED).json({
        data: HTTP_STATUS_DESCRIPTION.CREATED,
        code: StatusCodes.CREATED,
        success: HTTP_STATUS_DESCRIPTION.TRUE,
        message: HTTP_STATUS_DESCRIPTION.SUCCESS,
        ref: GUID,
      });
    }
  } catch (err) {
   await ErrorResponse(err,req, res, GUID);
  }
})
//#endregion

//#region LOGIN
router.post("/login",[
    check("username")
      .exists()
      .withMessage("user required")
      .notEmpty()
      .withMessage("user is empty")
      .isAlphanumeric()
      .withMessage("allow only alphabet and number"),
    check("password")
      .exists()
      .withMessage("pwd required")
      .notEmpty()
      .withMessage("pwd is empty")
      .isAlphanumeric()
      .withMessage("allow only alphabet and number")
  ], async (req, res) => {
  const GUID = uuid();
  const { username, password } = req.body; //object destructuring
  //evaluate right propereties are passed for client side validastion
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await audEvents(
      `BAD_REQUEST:${req.method}\t${serialize(errors)}\t${
        req.baseUrl + req.url
      }`,
      "Log",
      GUID
    );
    //but why are we logging remote client validation above any way its a good prctise
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: errors.array(),
      data: HTTP_STATUS_DESCRIPTION.BAD_REQUEST,
      code: StatusCodes.BAD_REQUEST,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: GUID,
    });
  }
  //evaluate right propereties are passed below for server side validation
  if (!username || !password) {
    await audEvents(
      `BAD_REQUEST:${req.method}\t invalid user id or password\t${
        req.baseUrl + req.url
      }`,
      "Log",
      GUID
    );
    return res.status(StatusCodes.BAD_REQUEST).json({
      data: HTTP_STATUS_DESCRIPTION.BAD_REQUEST,
      code: StatusCodes.BAD_REQUEST,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: GUID,
    });
  }
 try {
     await audEvents(
       `Request:${req.method}\tHeader:${serialize(
         req.headers
       )}\tBody${serialize(req.body)}\t url: ${
         req.headers.host + req.baseUrl + req.url
       }`,
       "Log",
       GUID
     );
   //evaluate user
   const foundUser = await User.findOne({ username: username }).exec();
   if (!foundUser) {
     await audEvents(
       `UNAUTHORIZED:${req.method}\t invalid username or password\t${
         req.baseUrl + req.url
       }`,
       "Log",
       GUID
     );
     return res.status(StatusCodes.UNAUTHORIZED).json({
       data: HTTP_STATUS_DESCRIPTION.UNAUTHORIZED,
       code: StatusCodes.UNAUTHORIZED,
       success: HTTP_STATUS_DESCRIPTION.FALSE,
       message: HTTP_STATUS_DESCRIPTION.FAIL,
       ref: GUID,
     });
   }
   //evaluate password
   const isPasswordCorrect = foundUser.comparePasswordWithAES(password);
   if (isPasswordCorrect) {
     const newFT = {
       id: foundUser._id,
       name: foundUser.username,
       token: foundUser.creatJWT(),
     };
     //#region saving refereshToken with current user MongoDB
     /* foundUser.refreshToken = jwt.sign(
      { userId: foundUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME, //time to expire (5min to 15min on prod)
        audience: process.env.AUDIENCE,
        issuer: process.env.ISSUER,
      }
    ); */
     const refreshToken = foundUser.postRefreshToken();
     await foundUser.save();
     //console.log(user.refreshToken); //dont forget to delete this on PROD
     //#endregion
     audEvents(
       `Response:${req.method}\t${serialize(newFT)}\t url:::${
         req.headers.host + req.baseUrl + req.url
       })}`,
       "Log",
       guid
     );
     //#region Sending RefereshToken
     //ensure u store d referesh token in memory dont store in local storage is not save...u can as well send it as  cookie (set it http-Only) with this is not vulnerable is not assceeble by javascript
     res.cookie("jwt", refreshToken, {
       httpOnly: true,
       sameSite: "None",
       maxAge: 24 * 60 * 60 * 1000,
     });
     //res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None',secure:true,maxAge:24*60*60*1000}); // on PROD
     //secure:true -only serves on https not in development please add this when creatingcookies as well in prod

     //pls dont send the refershToke in json to the client only the accessToken is most preferd, send the refersh token as a cookie
     //#endregion
     return res.status(StatusCodes.OK).json({
       data: newFT,
       code: StatusCodes.OK,
       success: true,
       expires: date.addSeconds(now, 300),
       ref: GUID,
     });
   } else {
     await audEvents(
       `Response:${req.method}\t access denied for ${username}\t url:${
         req.baseUrl + req.url
       })}`,
       "Log",
       GUID
     );
     return res.status(StatusCodes.UNAUTHORIZED).json({
       data: HTTP_STATUS_DESCRIPTION.UNAUTHORIZED,
       code: StatusCodes.UNAUTHORIZED,
       success: HTTP_STATUS_DESCRIPTION.FALSE,
       message: HTTP_STATUS_DESCRIPTION.FAIL,
       ref: GUID,
     });
   }
 } catch (error) {
       await ErrorResponse(err, req, res, GUID);
 }
});
//#endregion
module.exports = router;