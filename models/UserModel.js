const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username required"],
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: [10, "exceed maximun character count of 10"],
      minlength: [4, "below minimum character count of 4"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email  required"],
      trim: true,
      lowercase: true,
      maxlength: [50, "email exceed maximun character count of 50"],
      minlength: [5, "email below minimum character count of 5"],
      match: [/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, "invalid email"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password required"],
      maxlength: [15, "password exceed maximun character count of 15"],
      minlength: [5, "password below minimum character count of 5"],
    },
    refreshToken: String,
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);
//before i save the password in the DB what do i want to accomplish
//i want to hash the password this pre function will be called 
//by default before saving in the document

//********using bycryptJS **************/
/*
UserSchema.pre("save", async function () {
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});
*/

//**************using AES****** */
UserSchema.pre("save", function () {
  this.password = CryptoJS.AES.encrypt(
    this.password,
    process.env.PWD_SECRET
  ).toString();
});

/*
Instances of Models are documents. Documents have many of their own built-in instance 
methods. We may also define our own custom document instance methods.
**********************************************************************************
*/

UserSchema.methods.getName = function () {
  return this.username;
};
UserSchema.methods.getId = function () {
  return this._id;
};
UserSchema.methods.creatJWT = function () {
  //just for Demo normally provided by the DB..
  //below are the jwt payloads signature
  //1..try to keep payload small a better experinece for user.. pls avoid your password/confindential info and let it be an object
  //2..just for demo in production use long complex and ungessable string value!!!!!
  return jwt.sign(
    { userId: this._id, username: this.username, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,//time to expire (5min to 15min on prod)
      audience: process.env.AUDIENCE,
      issuer: process.env.ISSUER
    } 
  );
};
UserSchema.methods.postRefreshToken = function () {
  //just for Demo normally provided by the DB..
  //below are the jwt payloads signature
  //1..try to keep payload small a better experinece for user.. pls avoid your password/confindential info and let it be an object
  //2..just for demo in production use long complex and ungessable string value!!!!!
  return jwt.sign(
    { userId: this._id},
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_LIFETIME, //time to expire (5min to 15min on prod)
      audience: process.env.AUDIENCE,
      issuer: process.env.ISSUER,
    }
  );
};
UserSchema.methods.comparePasswordWithBycryptJS = async function (
  requestPassword
) {
  return await bycrypt.compare(requestPassword, this.password);
};

UserSchema.methods.comparePasswordWithAES = function (requestPassword) {
  this.password = CryptoJS.AES.decrypt(
    this.password,
    process.env.PWD_SECRET
  ).toString(CryptoJS.enc.Utf8);
  const isValid = this.password === requestPassword.trim() ? true : false;
  return isValid;
};

module.exports = mongoose.model("Ecommerceuser", UserSchema);
