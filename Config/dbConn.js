const mongoose = require('mongoose'); //elegant mongodb object modeling for node.js
const audEvents = require("../middleware/auditLogs");
const serialize = require("serialize-javascript");
const { v4: uuid } = require("uuid");

const connectDB=async () =>{
    try{
        await mongoose.connect(process.env.DATABASE_URL, {
          useUnifiedTopology: true, //for resolving issue errors from mongoose
          useNewUrlParser: true, //for resolving issue errors from mongoose
        });
    }catch(err){
        await audEvents(
          `Error:::connecting to mongoDB \t${serialize(err)} ${serialize(
            err.message
          )}`,
          "Log",
          uuid()
        );
        console.error(err);
    }
}

module.exports=connectDB