const { StatusCodes } = require("http-status-codes");
const { v4: uuid } = require("uuid");
const audEvents = require("./middleware/auditLogs");
const serialize = require("serialize-javascript");

exports.HTTP_STATUS_CODE = {
  CONFLICT: "58",
  OK: "00",
  NOT_FOUND: "99",
};
exports.HTTP_STATUS_DESCRIPTION = {
  SUCCESS: "success",
  NOT_EXIST: "student doesn't exist",
  FAIL: "failure",
  TRUE: true,
  FALSE: false,
  NO_CONTENT: "",
  BAD_REQUEST: "usrname and password are required",
  UNAUTHORIZED: "invalid user",
  FORBIDDEN: "unathorized to access the resources invalid token passed",
  CONFLICT: "duplicate request",
  CREATED: "user created successfully",
};
exports.ErrorResponse = async (err,req, res ,ref) => {
  
  console.error(err);
  if (err.name && err.name === "ValidationError") {
    await audEvents(
      `NOT_FOUND:::${StatusCodes.NOT_FOUND}:${req.method}\t message:${serialize(
        err + err.message
      )}\t url:${req.baseUrl + req.url})}`,
      "Log",
      ref
    );
    return res.status(StatusCodes.BAD_REQUEST).json({
      data: Object.values(err.errors)
        .map((item) => item.message)
        .join(","),
      code: StatusCodes.BAD_REQUEST,
      success: false,
      ref: ref,
    });
  }
  if (err.name && err.name === "CastError") {
    await audEvents(
      `NOT_FOUND:::${StatusCodes.NOT_FOUND}:${req.method}\t message:${serialize(
        err + err.message
      )}\t url:${req.baseUrl + req.url})}`,
      "Log",
      ref
    );
    return res.status(StatusCodes.NOT_FOUND).json({
      result: err,
      data: `no item found with request ${err.value}`,
      code: StatusCodes.NOT_FOUND,
      success: false,
      ref: ref,
    });
  }
  if (err.code && err.code === 11000) {

    await audEvents(
      `CONFLICT:::${StatusCodes.CONFLICT}:${req.method}\t message:${serialize(
        err + err.message
      )}\t url:${req.baseUrl + req.url})}`,
      "Log",
      ref
    );


    return res.status(StatusCodes.CONFLICT).json({
      result: err,
      data: `duplicate value for ${Object.keys(err.keyValue)}`,
      code: StatusCodes.CONFLICT,
      success: false,
      ref: ref,
    });
  }

   await audEvents(
     `INTERNAL_SERVER_ERROR:::${StatusCodes.INTERNAL_SERVER_ERROR}:${
       req.method
     }\t message:${serialize(err + err.message)}\t url:${
       req.baseUrl + req.url
     })}`,
     "Log",
     ref
   );

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    result: err,
    data: `error occured , please try again later!:::${err.message}`,
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
    message: 'failure',
    ref: ref,
  });
  
};
