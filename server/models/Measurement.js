const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: [true, "weight is required"],
  },
  neck: {
    type: Number,
    required: [true, "neck is required"],
  },
  chest: {
    type: Number,
    required: [true, "chest is required"],
  },
  waistAboveTheNavel: {
    type: Number,
    required: [true, "WaistAboveTheNavel is required"],
  },
  waistBelowNavel: {
    type: Number,
    required: [true, "WaistBelowNavel is required"],
  },
  hips: {
    // ханш
    type: Number,
    required: [true, "Hips is required"],
  },
  thigh: {
    type: Number,
    required: [true, "thigh is required"],
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  notes: {
    type: String,
    maxLength: [160, "Notes can be no longer that 160 characters"],
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

const Measurement = mongoose.model("Measurement", measurementSchema);

module.exports = Measurement;
