const mongoose = require("mongoose"); //elegant mongodb object modeling for node.js
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");

const CartsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "userid required"]
    },
    products:[ 
        {
       productId:{
        type: String,
       },
       quantity:{
        type: Number,
        default:1
       }     
      
       }
     ]
  },
  { timestamps: true }
);

/*
Instances of Models are documents. Documents have many of their own built-in instance 
methods. We may also define our own custom document instance methods.
**********************************************************************************
*/

CartsSchema.methods.getName = function () {
  return this.name;
};
CartsSchema.methods.getId = function () {
  return this._id;
};
CartsSchema.methods.creatJWT = function () {
  //just for Demo normally provided by the DB..
  //below are the jwt payloads signature
  //1..try to keep payload small a better experinece for user.. pls avoid your password/confindential info and let it be an object
  //2..just for demo in production use long complex and ungessable string value!!!!!
  return jwt.sign(
    { userId: this._id, username: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME } //time to expire (5min to 15min on prod)
  );
};

CartsSchema.methods.comparePassword = async function (requestPassword) {
  return await bycrypt.compare(requestPassword, this.password);
};

module.exports = mongoose.model("Ecommercecart", CartsSchema);
