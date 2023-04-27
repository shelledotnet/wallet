const { StatusCodes } = require("http-status-codes");
const { v4: uuid } = require("uuid");

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
exports.ErrorResponse = (err, res) => {
  console.error(err);
  if (err.name && err.name === "ValidationError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      data: Object.values(err.errors)
        .map((item) => item.message)
        .join(","),
      code: StatusCodes.BAD_REQUEST,
      success: false,
      ref: uuid(),
    });
  }
  if (err.name && err.name === "CastError") {
    return res.status(StatusCodes.NOT_FOUND).json({
      result: err,
      data: `no item found with request ${err.value}`,
      code: StatusCodes.NOT_FOUND,
      success: false,
      ref: uuid(),
    });
  }
  if (err.code && err.code === 11000) {
    return res.status(StatusCodes.CONFLICT).json({
      result: err,
      data: `duplicate value for ${Object.keys(err.keyValue)}`,
      code: StatusCodes.CONFLICT,
      success: false,
      ref: uuid(),
    });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    result: err,
    data: "error occured , please try again later!",
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
    ref: uuid(),
  });
};
