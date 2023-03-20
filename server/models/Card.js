const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Type is required'],
  },
  start: {
    type: Date,
    required: [true, "Start date is required"],
  },
  end: {
    type: Date,
    required: [true, "End date is required"],
  },
  trainingsLeft: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  trainings: [
    {
      trainer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      date: {
        type: Date,
      },
    },
  ],
  notes: {
    type: String,
    maxLength: [160, "Notes can be no longer that 160 characters"],
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  trainer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    required: true,
  },
  modified: {
    type: Date,
  },
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
