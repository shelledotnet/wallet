const mongoose = require('mongoose'); //elegant mongodb object modeling for node.js
const Schema=mongoose.Schema;//note everything in mongoose start with a schema

const employeeSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    /*  DateCreated:{
        type: Date,
        default:Date.now
    } */
  },
  { timestamps: true }
);
//ensure the model name is not plural an takes the name of the file pascal casing
//model should take the filename sigular...mongoose willpluralizsed it with all lowercase
module.exports=mongoose.model('Employee',employeeSchema);