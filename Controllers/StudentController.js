//#region  Dependencys
require("dotenv").config(); //accessing the environment variables
const {v4:uuid}=require('uuid');
const { validationResult } = require("express-validator");
//const knex=require("../Config/Conn");  //what comes back from require knex are functions 
const dataSource = require("../Config/kbnex-cfg").development;  //what comes back from require knex are functions 
const knex=require("knex")(dataSource);  //what comes back from require knex are functions 
const {StatusCodes}=require('http-status-codes');
const date = require("date-and-time");
const nodemailer = require("nodemailer");
const now  =date.addHours(new Date(),1);
const audEvents = require("../middleware/auditLogs");
const serialize = require("serialize-javascript");
const { roundToNearestMinutes } = require("date-fns");
const {HTTP_STATUS_CODE,HTTP_STATUS_DESCRIPTION} = require('../Global');
const fetch = require("node-fetch"); 
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
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
let getAllStudent = async (req, res) => {
  const guid = uuid();
   try {
     //const users = await knex("tbl_students").select("title", "band", "venue","price")
     //.limit(2).first().distinct();
     //const query=await knex("book").select(knex.raw("COUNT(*) as BookCount"));
     //const query=await knex("book").knex.raw("select price where id=2"));
     const users = await knex("tbl_students")
       .select(
         "title",
         "band",
         "venue",
         "price",
         knex.raw("price as BookCount")
       )
       .distinct();
     console.log(users);
     if (users.length !== 0) {
       audEvents(
         `Response:${req.method}\t${req.hostname}\t${req.path}\t${serialize(users)}\t /api/v1/students${req.url}`,
         "Log",
         guid
       );
       //user.unshift()
       return res.status(StatusCodes.OK).json({
         count: users.length,
         data: users.length > 1 ? users : users[0],
         code: StatusCodes.OK,
         success: true,
         ref: guid,
       });
     }
     await audEvents(
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
    await audEvents(
      `Error:${req.method}\t${serialize(err.message)}\t /api/v1/students${
        req.url
      }`,
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

let getAllStudent_Raw = async (req, res) => {
  const guid = uuid();
  try {
    //const users = await knex("tbl_students").select("title", "band", "venue","price")
    //.limit(2).first().distinct();
    //const query=await knex("book").select(knex.raw("COUNT(*) as BookCount"));
    //const query=await knex("book").knex.raw("select price where id=2"));

    const [users, _] = await knex.raw("select distinct band ,  venue from tbl_students");
    //using array distructure to pull out first array
    //node is event driven most of the function u will be dealing wiht return promises and we have to consume them using promise syntax
    //.then() and .catch() however a more better way of consuming this promises is using async/await syntax this make your code easier and readable
    //this method has promise we use a modern promise key word await operator  here
    //promise has 2 agument reject() and resolve()
    //it will return both the field and actual raw data
    console.log(_);
    
    if (users.length !== 0) {
     // Object.freeze(users); 
      users.unshift({"band":"fatimah"});//add infront of the array
      users.push({"band":"loving"});//add behind the array
     // Object.freeze(users);  //do not alter the response
     // users.shift()//remove from front of an array andd return the removed element
     // users.pop()//remove from behind and return the removed element
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
   await audEvents(
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
   await audEvents(
     `Error:${req.method}\t${serialize(err.message)}\t /api/v1/students${
       req.url
     }`,
     "Log",
     guid
   );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: `issue completing request ${err.message}`,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      ref: guid,
    });
  }
};

let createStudent = async (req, res) => {
  const GUID = uuid(); 
  const { title, band, venue,price} = req.body;
//  console.log(req);
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
    await audEvents(
      `BAD_REQUEST:${req.method}\t${serialize(errors)}\t /api/v1/students${
        req.url
      }`,
      "Log",
      GUID
    );
  
     return res
       .status(StatusCodes.BAD_REQUEST)
       .json({
      errors: errors.array() ,
      code: StatusCodes.BAD_REQUEST,
      success: false,
      ref: GUID
    });
   

  }
  try {
  await audEvents(
    `Request:${req.method}\tHeader:${serialize(req.headers)}\tBody${serialize(
      req.body
    )}\t ${req.baseUrl}`,
    "Log",
    GUID
  );
    let [created,_] = await knex("tbl_students").insert({
      title,
      band,
      venue,
      price,
      dateCreated: new Date(),
    });
    console.log(created);
    if (created) {
      audEvents(
        `Response:Header:${serialize(res.headers)}\t ${serialize(
          StatusCodes.CREATED
        )}\tstudent created successfully)}`,
        "Log",
        GUID
      );
      console.log(res)
      return res.status(StatusCodes.CREATED).json({
        data: ` student created successfully`,
        code: StatusCodes.CREATED,
        success: true,
        ref: GUID,
      });
    }
  await audEvents(
    `BAD_GATEWAY:${req.method}\t failed to insert\t /api/v1/students${req.url})}`,
    "Log",
    GUID
  );
    return res.status(StatusCodes.BAD_GATEWAY).json({
      data: users,
      code: StatusCodes.BAD_GATEWAY,
      success: false,
      ref: GUID,
    });
  } catch (err) {
  await audEvents(
    `INTERNAL_SERVER_ERROR:${req.method}\t message:${serialize(
      err.message
    )}\t /api/v1/students${req.url})}`,
    "Log",
    GUID
  );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: err.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      ref: GUID,
    });
  } 
};
let createStudent_raw = async (req, res) => {
  const GUID = uuid();
  const { title, band, venue, price } = req.body;
  //  console.log(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   await audEvents(
     `BAD_REQUEST:${req.method}\t${serialize(errors)}\t /api/v1/students${
       req.url
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
   await audEvents(
     `Request:${req.method}\tHeader:${serialize(req.headers)}\tBody${serialize(
       req.body
     )}\t ${req.baseUrl}`,
     "Log",
     GUID
   );
    function dateCreated(){
      let d = new Date();
      let yr = d.getFullYear();
      let mm = d.getMonth() + 1; //month in javascript start from o index
      let dd = d.getDate(); // this return number of day in the month
      return `${yr}-${mm}-${dd}`;
    }
    
    const result = await knex.raw(
      `INSERT INTO tbl_students (title,band,venue,price,dateCreated) VALUES(
              '${title}',
              '${band}',
              '${venue}',
              '${price}',
              '${dateCreated()}'
            )`
    );
    console.log(result);
    const [created, _] = result;
    //using array distructure to pull out first array or object
    //this function return promise which should have await operator
    //it will return both the field and actual raw data
    if (created.affectedRows === 1) {
      audEvents(
        `Response:Header:${serialize(res.headers)}\tBody:${serialize(
          result
        )}\tstudent created successfully ${StatusCodes.CREATED}`,
        "Log",
        GUID
      );
      // console.log(res);
      return res.status(StatusCodes.CREATED).json({
        data: `id ${created.insertId} student created successfully`,
        code: StatusCodes.CREATED,
        success: true,
        ref: GUID,
      });
    }
   await audEvents(
     `BAD_GATEWAY:${req.method}\t failed to insert\t /api/v1/students${req.url})}`,
     "Log",
     GUID
   );
    return res.status(StatusCodes.BAD_GATEWAY).json({
      data: users,
      code: StatusCodes.BAD_GATEWAY,
      success: false,
      ref: GUID,
    });
  } catch (err) {
   await audEvents(
     `INTERNAL_SERVER_ERROR:${req.method}\t message:${serialize(
       err.message
     )}\t /api/v1/students${req.url})}`,
     "Log",
     GUID
   );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: err.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      ref: GUID,
    });
  }
};

let getStudentById = async (req, res) => {
  const guid = uuid();
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   await audEvents(
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
   await audEvents(
     `Request:Header:${serialize(req.headers)}\t${req.method}\t${serialize(
       req.params
     )}\t${req.baseUrl + req.url}`,
     "Log",
     guid
   );
    const result = await knex("tbl_students")
      .where({ id })
      .select("title", "band", "venue", "price");
  
    console.log(result);
    if (result.length !== 0) {
      audEvents(
        `Response:${req.method}\t id find was successfull-${serialize(
          result
        )}\t url:/api/v1/students${req.url}}`,
        "Log",
        guid
      );
      return res
        .status(StatusCodes.OK)
        .json({
          data: result[0],
          code: StatusCodes.OK,
          success: true,
          ref: guid,
        });
    }
   await audEvents(
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
   await audEvents(
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

let getStudentById_Raw = async (req, res) => {
  const guid = uuid();
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   await audEvents(
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
   await audEvents(
     `Request:${req.method}\t${serialize(req.params)}\t /api/v1/students${
       req.url
     }`,
     "Log",
     guid
   );

    //below uses bindings which guide against sql injection attack
   const [result,_] = await knex.raw("SELECT title,band,venue,price FROM tbl_students WHERE id = ?", [id]);
    console.log(result);
    if (result.length !== 0) {
     await audEvents(
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
   await audEvents(
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
   await audEvents(
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

let getTodoId_Raw = async (req, res) => {
  const guid = uuid();
  const { id } = req.params;
  let boolOutput = id.toLowerCase() == 'true' ? true : false; //ternary operator returns boolean
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   await audEvents(
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
   await audEvents(
     `Request:${req.method}\t${serialize(req.params)}\t /api/v1/students${
       req.url
     }`,
     "Log",
     guid
   );

    //below uses bindings which guide against sql injection attack wiht storedProc
    const [result, _] = await knex.raw("CALL new_filterTodos(?)", [boolOutput]);
    console.log(result);
    if (result.length !== 0) {
     await audEvents(
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
   await audEvents(
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
   await audEvents(
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

let deleteStudentById_Raw = async (req, res) => {
  const guid = uuid();
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  await audEvents(
    `Method::${req.method}\t${serialize(errors)}\t${StatusCodes.BAD_REQUEST}\t${
     req.baseUrl + req.url
    } `,
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
   await audEvents(
     `Request:${req.method}\t${serialize(req.params)}\t /api/v1/students${
       req.url
     }`,
     "Log",
     guid
   );

    //below uses bindings which guide against sql injection attack
    const result = await knex.raw("DELETE  FROM tbl_students WHERE id = ?", [
      id,
    ]);
    console.log(result);
    const [deleted, _] = result;
    //using array distructure to pull out first array or object
    //this function return promise which should have await operator
    //it will return both the field and actual raw data
    if (deleted.affectedRows === 1) {
     await audEvents(
       `Response:Method:${req.method}\tHeaders:${serialize(
         res.headers
       )}\tBody:student id ${id} deleted  successfull-${serialize(
         result
       )}\t url:/api/v1/students${req.url}}`,
       "Log",
       guid
     );
      return res.status(StatusCodes.OK).json({
        data: `student id ${id} deleted  successfull`,
        code: StatusCodes.OK,
        success: true,
        ref: guid,
      });
    }
    else if (deleted.affectedRows === 0) {
     await audEvents(
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
    }
  } catch (err) {
   await audEvents(
     `INTERNAL_SERVER_ERROR:${req.method}\t message:${serialize(
       err
     )}\t ${req.baseUrl + req.url})}`,
     "Log",
     guid
   );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: `${err.message} error completing request`,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      ref: guid,
    });
  }
};

const sendMail=async (req,res)=>{
  const guid = uuid();
  const transporter = nodemailer.createTransport({
    service: "outlook.com",
    auth: {
      user: "shelledotnet@outlook.com",
      pass: "ELLehs1189@fati"
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

const fetchApi = async (req, res) => {
  const guid = uuid();
  try {
  
      const body = { requestId: "5465454", id: "YV111111111111FY" };
      await audEvents(
        `Request:${req.method}\t${serialize(body)}\t /api/v1/students${
          req.url
        }`,
        "Log",
        guid
      );

      const response = await fetch(process.env.END_POINT, {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", client_id: "123" },
      });
      const datas = await response.json();
      console.log(response);
      console.log(datas);
      if (datas !== null && datas.code === HTTP_STATUS_CODE.CONFLICT) {
       await audEvents(
         `Response:${req.method}\t duplicate request-${serialize(
           datas
         )}\t ${serialize(response)} \turl:/api/v1/students${req.url}}`,
         "Log",
         guid
       );
        return res.status(StatusCodes.CONFLICT).json({
          response:  datas ,
          code: StatusCodes.CONFLICT,
          success: HTTP_STATUS_DESCRIPTION.FALSE,
          message:HTTP_STATUS_DESCRIPTION.FAIL,
          ref: guid,
        });
      }
      if (datas !== null && datas.code === HTTP_STATUS_CODE.OK) {
        await audEvents(
          `Response:${req.method}\t call was successfull-${serialize(
            datas
          )}\t ${serialize(response)} \t url:/api/v1/students${req.url}}`,
          "Log",
          guid
        );
         return res.status(StatusCodes.OK).json({
           response: datas,
           code: StatusCodes.OK,
           success: HTTP_STATUS_DESCRIPTION.TRUE,
           message:HTTP_STATUS_DESCRIPTION.SUCCESS,
           ref: guid,
         });
      }
    return res.status(StatusCodes.NOT_FOUND).json({
      data: HTTP_STATUS_DESCRIPTION.NOT_EXIST,
      code: StatusCodes.NOT_FOUND,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message:HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  } catch (err) {
   await audEvents(
     `Error:${req.method}\t${serialize(err.message)}\t${req.baseUrl}${
       req.path
     }${req.url}`,
     "Log",
     guid
   );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: `issue completing request ${err.message}`,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      success: HTTP_STATUS_DESCRIPTION.FALSE,
      message: HTTP_STATUS_DESCRIPTION.FAIL,
      ref: guid,
    });
  }
};
//#endregion

module.exports = {
  getAllStudent,
  getAllStudent_Raw,
  getTodoId_Raw,
  createStudent,
  createStudent_raw,
  getStudentById,
  getStudentById_Raw,
  deleteStudentById_Raw,
  sendMail,
  fetchApi
};

//#region JS Practice
const dns = require('dns');
const os = require('os');
const { format } = require("path");
//console.log(os.hostname());
//console.log(os.userInfo().username);
//setInterval(function(){console.log('loving you fatimah')},1000)
dns.lookup('pluralsight.com',(err,address)=>{
  if(err){
    //console.log(err);
  }else{
    //console.log(address);
  }
  
});

let words = "Franklin Roosevelt Roosevelt kemi Roosevelt";
let chematch = /(\w+)\1\1/gi;
let replceMatch = /roosevelt/gi;
//console.log(words.replace(replceMatch,"President"));
//console.log('Node'.padEnd(8,'*'));
const fruitDrink = ["Banana", "Orange", "Apple", "Mango"];
fruitDrink.sort()
//console.log(fruitDrink.reverse());
const points = [40, 100, 1, 5, 25, 10];
//console.log(Math.min.apply(null,points));
const persons = {"firstname":"seyi"};
//console.log(persons["firstname"]);
let password = "821g9898982&";
let checkPass = /(\w{3,6})(\d{1})(\W{1})/; //3 to 6 alpahnymeric characters , at least 1 number , atleast 1 non alphanumeric
//console.log(checkPass.test(password));
const fruits = ["Banana", "Orange", "Apple", "Mango"];
let fruit = "";
for(let i = 0 ; i < fruits.length ; i++){
   fruit += fruits[i] + ",";
}
//console.log(fruit);
let quote = "aabes blind mice. deh";
let biginWith = /^abe/i;
let endWith = /deh$/i;
let includes_alphanumeric = /[A-Za-z0-9_]+/gi;  // \w+
let exclude_alphanumeric = /[^A-Za-z0-9_]+/gi;  // \W
let includeDigit = /[0-9]/g;//\d
let excludeDigit = /[^0-9]/g;//\D
let includeWhiteSpace = /\s/g;
let excludeWhiteSpace = /\S/g;
let digitEnd = /[0-9]$/
let username = "ade@3445"
//console.log(digitEnd.test(username));
//console.log(includes_alphanumeric.test(username));
// console.log(biginWith.test(quote));
// console.log(endWith.test(quote));
let quoteSampleNumber = "aaaaaaaaaBlue=berry3141592653sare @delicious";
let quoteSample = "Bewa it correct not tried Free";
let charMatch = /[!@#$%^;&*()+= ]/i;
let cat = "cat";
let gre = /[^A-Za-z0-9_ @]/gi;
let wiiMatch = /\W /;
let digitMatch = /[0-9]/g;//\d
let nondigitMatch = /[^0-9]/g;//\D
let bewaRegex = /^bewa/i;
let storyRegex = /free$/i;
let getMatch = /[a-z]/i
let matchNum = /[h-s2-6]/i
let notVowels = /[^aeiou0-9]/
//console.log(quoteSampleNumber.match(nondigitMatch).length);
//console.log(gre.test(quoteSampleNumber));
const person = { firstName: "John", lastName: "Doe" };
person.age = 45 ;
const cars = ["Saab", "Volvo", "BMW"];
cars.push("Toyota");
cars.unshift("Daewoo");
cars.pop();
cars.unshift();
const dates = new Date();
//console.log(dates.getDate().toLocaleString());
//console.log(123e-5);
//console.log(myFunction(4, 3)); // Function is called, return value will end up in x
function myFunction(a, b) {
  return a * b; // Function returns the product of a and b
}
let texts = "Apple";
const textsRegex = /ap{2}le/i;
//console.log(textsRegex.test(texts));
let numb = 5;
let text = numb.toString();
//console.log(text.padEnd(4, "0"));
//console.log(texts[9]);
// console.log(text.slice(-12));
// console.log(text.substring(7, 13));
// console.log(text.replace(/apple/gi,'mango'));
//console.log("loving you\n".repeat(5));
fs.readFile('Log/20230108.txt','utf8',(err,data)=>{
  if(err)throw err
  //console.log(data);
  //console.log('read complete');
})

process.on('uncaughtexception',err => {
  console.log(`thera was an uncaught error:- ${err}`);
  process.exit(1);
})


//#endregion
 