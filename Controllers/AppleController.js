//#region  Dependencys
require("dotenv").config(); //accessing the environment variables
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
//const knex=require("../Config/Conn");  //what comes back from require knex are functions
const dataSource = require("../Config/kbnex-cfg").production; //what comes back from require knex are functions
const knex = require("knex")(dataSource); //what comes back from require knex are functions
const { StatusCodes } = require("http-status-codes");
const date = require("date-and-time");
const nodemailer = require("nodemailer");
const now = date.addHours(new Date(), 1);
const audEvents = require("../middleware/auditLogs");
const serialize = require("serialize-javascript");
const { roundToNearestMinutes } = require("date-fns");

//#endregion

//#region ActionMethod
// const register=async(req,res)=>{
//     const { username, email, password } = req.body;
//     if (!username || !email || !password)
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "Username /email and password ae required." });

//    const newUser = new Ecommerceuser({
//      username: req.body.username,
//      email: req.body.email,
//      password: req.body.password,
//    });
//    const guid = uuid();
//    try{

//       audEvents(
//         `Request:${req.method}\t${serialize(req.body)}\t /api/v1/auth/${
//           req.url
//         })}`,
//         "Log",
//         guid
//       );
//      const users = await Ecommerceuser.create(newUser);
//     const newFT={id:users.getId(),name:users.getName(),token:users.creatJWT()};
//     audEvents(
//       `Response:${req.method}\t${serialize(users)}\t /api/v1/auth/${
//         req.url
//       })}`,
//       "Log",
//       guid
//     );
//     return res
//       .status(StatusCodes.CREATED) // this is seen by the client tool
//       .json({
//         data: newFT,
//         code: StatusCodes.CREATED,
//         success: true,
//         ref: guid,
//       });
//    }catch(err){
// audEvents(
//       `Respose:${req.method}\t${serialize(err.message)}\t /api/v1/auth/${
//         req.url
//       })}`,
//       "Log",
//       guid
//     );
// return res
//   .status(StatusCodes.INTERNAL_SERVER_ERROR) // this is seen by the client tool
//   .json({
//     data: err.message, //newFT,
//     code: StatusCodes.INTERNAL_SERVER_ERROR,
//     success: false,
//     ref: uuid(),
//   });
//    }

// }
const getAllApple = async (req, res) => {
  const guid = uuid();
  try {

    const users = await knex.raw(
      "SELECT distinct age FROM [AuthJwtDb].[dbo].[User] order by age desc"
    );

    if (users.length !== 0) {
      audEvents(
        `Response:${req.method}\t${serialize(users)}\t /api/v1/students${
          req.url
        }`,
        "Log",
        guid
      );
      return res.status(StatusCodes.OK).json({
        count: users.length,
        data: users.length > 1 ? users : users[0],
        code: StatusCodes.OK,
        success: true,
        ref: guid,
      });
    }
    audEvents(
      `NOT_FOUND:${req.method}\t records doesn't exist\t /api/v1${req.url})}`,
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
      `Error:${req.method}\t${serialize(err.message)}\t /api/v1/students${
        req.url
      }`,
      "Log",
      guid
    );
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: err.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      ref: guid,
    });
  }
};

const CreateStudent = async (req, res) => {
  const guid = uuid();
  const { title, band, venue, price } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    audEvents(
      `BAD_REQUEST:${req.method}\t${serialize(errors)}\t /api/v1/students${
        req.url
      }`,
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
      `Request:${req.method}\t${serialize(req.body)}\t /api/v1/students${
        req.url
      }`,
      "Log",
      guid
    );
    const created = await knex("tbl_students").insert({
      title,
      band,
      venue,
      price,
      dateCreated: new Date(),
    });
    console.log(created);
    if (created) {
      audEvents(
        `Response:${req.method}\t student created successfully\t url:/api/v1/students${req.url})}`,
        "Log",
        guid
      );
      return res.status(StatusCodes.CREATED).json({
        data: "student created successfully",
        code: StatusCodes.CREATED,
        success: true,
        ref: guid,
      });
    }
    audEvents(
      `BAD_GATEWAY:${req.method}\t failed to insert\t /api/v1/students${req.url})}`,
      "Log",
      guid
    );
    return res.status(StatusCodes.BAD_GATEWAY).json({
      data: users,
      code: StatusCodes.BAD_GATEWAY,
      success: false,
      ref: guid,
    });
  } catch (err) {
    audEvents(
      `INTERNAL_SERVER_ERROR:${req.method}\t message:${serialize(
        err.message
      )}\t /api/v1/students${req.url})}`,
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

const getStudentById = async (req, res) => {
  const guid = uuid();
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    audEvents(
      `BAD_REQUEST:${req.method}\t${serialize(errors)}\t /api/v1/students${
        req.url
      }`,
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
      `Request:${req.method}\t${serialize(req.params)}\t /api/v1/students${
        req.url
      }`,
      "Log",
      guid
    );
    const result = await knex("tbl_students")
      .where({ id })
      .select("title", "band", "venue", "price");
    const [result1, _] = await knex.raw("select * from tbl_students");
    //using array distructure to pull out first array
    //this method has promise we need await operator here
    //it will return both the field and actual raw data
    console.log(result1);
    if (result.length !== 0) {
      audEvents(
        `Response:${req.method}\t id find was successfull-${serialize(
          result
        )}\t url:/api/v1/students${req.url}}`,
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
      `NOT_FOUND:${req.method}\t id ${id} doesn't exist\t /api/v1/students${req.url})}`,
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
      )}\t /api/v1/students${req.url})}`,
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

const sendMail = async (req, res) => {
  const guid = uuid();
  const transporter = nodemailer.createTransport({
    service: "outlook.com",
    auth: {
      user: "shelledotnet@outlook.com",
      pass: "ELLehs1189@fati",
    },
  });
  var mailOptions = {
    from: "shelledotnet@outlook.com",
    to: "shelledotnet@gmail.com",
    // to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
    subject: "Sending Email using Node.js",
    text: "That was easy!",
    //html: "<h1>Welcome</h1><p>That was easy!</p>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: "error completing request",
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        ref: guid,
      });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(StatusCodes.OK).json({
        data: "email sent succesfully",
        code: StatusCodes.OK,
        success: true,
        ref: guid,
      });
    }
  });
};

//#endregion

module.exports = { getAllApple, CreateStudent, getStudentById, sendMail };
