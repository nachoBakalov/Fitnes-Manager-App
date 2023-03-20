const mongoose = require("mongoose");
const { isEmail, isURL, isMobilePhone } = require("validator");

const User = require("./Manager");

const userShema = new mongoose.Schema({
  username: {
    type: String,
    // required: [true, 'clientname is required'],
    unique: true,
    required: [
      function () {
        return !this.email;
      },
      "Username or email is required.",
    ], // Only required if email is not populated
  },
  email: {
    type: String,
    unique: true,
    required: [
      function () {
        return !this.username;
      },
      "Username or email is required.",
    ], // Only required if username is not populated
    validate: {
      validator: isEmail,
      message: "{VALUE} is not a valid email",
      isAsync: false,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  image: {
    type: String,
    validate: {
      validator: isURL,
      message: "{VALUE} is not a valid URL",
      isAsync: false,
    },
  },
  name: {
    type: String,
  },
  phone: {
    type: Number,
    validate: {
      validator: isMobilePhone,
      message: "{VALUE} is not a valid phone number",
      isAsync: false
    }
  },
  target: {
    type: String,
  },
  notes: {
    type: String,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: User,
  },
  created: {
    type: Date,
    required: true,
  },
  modified: {
    type: Date,
  },
});

const User = mongoose.model("User", userShema);

module.exports = User;
