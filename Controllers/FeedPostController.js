//#region  Dependencys
require("dotenv").config(); //accessing the environment variables
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const knex = require("../Config/Conn");
const { StatusCodes } = require("http-status-codes");
const date = require("date-and-time");
const Post=require('../models/PostModel')
const now = date.addHours(new Date(), 1);
const audEvents = require("../middleware/auditLogs");
const serialize = require("serialize-javascript");
//#endregion

//#region ActionMethod
exports.getAllPosts = async (req, res, next) => {
   const guid = uuid();
   try {
  const [records, _]=  await Post.FindAll();
  //using array distructure to pull out first array
  //this method has promise we need await operator here 
  //it will return both the field and actual raw data
  console.log(records)
     if(records.length !== 0){
      audEvents(
        `Response:${req.method}\t${serialize(records)}\t /api/v1/feeds${
          req.url
        }`,
        "Log",
        guid
      );
      return res.status(StatusCodes.OK).json({
        count: records.length,
        data: records.length > 1 ? records : records[0],
        code: StatusCodes.OK,
        success: true,
        ref: guid,
      });
     }
     audEvents(
       `NOT_FOUND:${req.method}\t records doesn't exist\t /api/v1/feeds${req.url})}`,
       "Log",
       guid
     );
     return res.status(StatusCodes.NOT_FOUND).json({
       data: "student doesn't exist",
       code: StatusCodes.NOT_FOUND,
       success: false,
       ref: guid,
     });
   } catch (err) {
     audEvents(
       `Error:${req.method}\t${serialize(err.message)}\t /api/v1/feeds${req.url}`,
       "Log",
       guid
     );
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
       data: err.message,
       code: StatusCodes.INTERNAL_SERVER_ERROR,
       success: false,
       ref: guid,
     });
   }
};
exports.createNewPost = async (req, res, next) => {
  const GUID = uuid();
  const { title, body} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    audEvents(
      `BAD_REQUEST:${req.method}\t${serialize(errors)}\t /api/v1${req.url}`,
      "Log",
      guid
    );

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: errors.array(),
      code: StatusCodes.BAD_REQUEST,
      success: false,
      ref: guid,
    });
  }
   try {
     audEvents(
       `Request:Method:${req.method}\tHeaders:${serialize(req.headers)}\tBody:${serialize(req.body)}\t /api/v1/feeds${
         req.url
       }`,
       "Log",
       GUID
     );
     const post = new Post(title, body);
     const [created, _] = await post.Save(); // the return type is promise (reject/resolve)
     //using array distructure to pull out first array
     //this function return promise which should have await operator
     //it will return both the field and actual raw data
     if (created.affectedRows === 1) {
       audEvents(
         `Response:Method:${req.method}\tHeader:${serialize(res.headers)}\tBody: post created successfully-${serialize(
           created
         )}\t url:/api/v1/feeds${req.url}}`,
         "Log",
         GUID
       );
       return res.status(StatusCodes.CREATED).json({
         data: `post with id ${created.insertId} wascreated successfully`,
         code: StatusCodes.CREATED,
         success: true,
         ref: GUID,
       });
     }
     audEvents(
       `BAD_GATEWAY:${req.method}\t failed to insert${serialize(
         created
       )}\t /api/v1/feeds${req.url})}`,
       "Log",
       GUID
     );
     return res.status(StatusCodes.BAD_GATEWAY).json({
       data: "unable to create user",
       code: StatusCodes.BAD_GATEWAY,
       success: false,
       ref: guid,
     });
   } catch (err) {
     audEvents(
       `INTERNAL_SERVER_ERROR:${req.method}\t message:${serialize(
         err.message
       )}\t /api/v1/feeds${req.url})}`,
       "Log",
       GUID
     );
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
       data: "error completing request",
       code: StatusCodes.INTERNAL_SERVER_ERROR,
       success: false,
       ref: GUID,
     });
   }
 
};

exports.getPostById = async (req, res, next) => {
   const guid = uuid();
   const { id } = req.params;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     audEvents(
       `BAD_REQUEST:${req.method}\t${serialize(errors)}\t /api/v1${req.url}`,
       "Log",
       guid
     );

     return res.status(StatusCodes.BAD_REQUEST).json({
       errors: errors.array(),
       code: StatusCodes.BAD_REQUEST,
       success: false,
       ref: guid,
     });
   }
   try {
     audEvents(
       `Request:${req.method}\t${serialize(req.params)}\t /api/v1/feeds${
         req.url
       }`,
       "Log",
       guid
     );
     var [result, _] = await Post.FindById(id);
     //using array distructure to pull out first array
     //this function is a promise that nede await operator
     //it will return both the field and actual raw data
     console.log(result);
     if (result.length !== 0) {
       audEvents(
         `Response:${req.method}\t id find was successfull-${serialize(
           result
         )}\t url:/api/v1/feeds${req.url}}`,
         "Log",
         guid
       );
       return res.status(StatusCodes.OK).json({
         data: result[0],
         code: StatusCodes.OK,
         success: true,
         ref: guid,
       });
     }
     audEvents(
       `NOT_FOUND:${req.method}\t id ${id} doesn't exist\t /api/v1/feeds${req.url})}`,
       "Log",
       guid
     );
     return res.status(StatusCodes.NOT_FOUND).json({
       data: `id ${id} doesn't exist`,
       code: StatusCodes.NOT_FOUND,
       success: false,
       ref: guid,
     });
   } catch (err) {
     audEvents(
       `INTERNAL_SERVER_ERROR:${req.method}\t message:${serialize(
         err.message
       )}\t /api/v1/feeds${req.url})}`,
       "Log",
       guid
     );
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
       data: "error completing request",
       code: StatusCodes.INTERNAL_SERVER_ERROR,
       success: false,
       ref: guid,
     });
   }

};
//#endregion
