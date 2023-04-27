const mongoose = require('mongoose'); //elegant mongodb object modeling for node.js
const Schema=mongoose.Schema;

const userSchema = new Schema(
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
      maxlength: [20, "email exceed maximun character count of 20"],
      minlength: [5, "email below minimum character count of 5"],
      match: [/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, "invalid email"],
    },
    roles: {
      User: {
        type: Number,
        default: 2001,
      },
      Editor: Number,
      Admin: Number,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password required"],
      maxlength: [100, "password exceed maximun character count of 100"],
      minlength: [5, "password below minimum character count of 5"],
    },
      refreshToken: String,
      refreshTokenExpired: Boolean,
      refreshTokenActive: Boolean,
      refreshTokenExpiredDate: Date
    /*  DateCreated: {
    type: Date,
    default: Date.now,
  }, */
  },
  { timestamps: true }
);
//ensure the model name is not plural an takes the name of the file pascal casing
//model should take the filename sigular...mongoose willpluralizsed it with all lowercase
module.exports=mongoose.model('User',userSchema);