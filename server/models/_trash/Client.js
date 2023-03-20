const mongoose = require("mongoose");
const { isEmail } = require("validator");

const clientShema = new mongoose.Schema({
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
      isAsync: false,
    },
  },
  target: {
    type: String,
    maxLength: [160, "Target can be no longer that 160 characters"],
  },
  foodRegime: {
    type: String,
    maxLength: [160, "Food regime can be no longer that 160 characters"],
  },
  notes: {
    type: String,
    maxLength: [160, "Notes can be no longer that 160 characters"],
  },
  lastVisit: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: false,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "Trainer",
  },
  created: {
    type: Date,
    required: true,
  },
  modified: {
    type: Date,
  },
});

const User = mongoose.model("User", clientShema);

module.exports = User;
