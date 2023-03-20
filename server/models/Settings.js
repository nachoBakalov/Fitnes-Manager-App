const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  managers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Trainer",
    },
  ],
  managersAllowedPaths: {
    type: [String],
    default: [
      "/clients",
      "/clients/:id",
      "/clients/:id/username",
      "/clients/:id/email",
      "/clients/:id/password",
      "/clients/:id/image",
      "/clients/:id/name",
      "/clients/:id/phone",
      "/clients/:id/target",
      "/clients/:id/food-regime",
      "/clients/:id/notes",
      "/clients/:id/status",
      "/trainers",
      "/trainers/:id",
      "/trainers/:id/username",
      "/trainers/:id/email",
      "/trainers/:id/password",
      "/trainers/:id/image",
      "/trainers/:id/name",
      "/trainers/:id/phone",
      "/trainers/:id/target",
      "/trainers/:id/food-regime",
      "/trainers/:id/notes",
      "/trainers/:id/status",
      "/measures",
    ],
  },
  trainersAllowedPaths: {
    type: [String],
    default: [
      "/clients",
      "/clients/:id",
      "/clients/:id/username",
      "/clients/:id/email",
      "/clients/:id/password",
      "/clients/:id/image",
      "/clients/:id/name",
      "/clients/:id/phone",
      "/clients/:id/target",
      "/clients/:id/food-regime",
      "/clients/:id/notes",
      "/clients/:id/status",
      "/measures",
    ],
  },
  clientsAllowedPaths: {
    type: [String],
    default: [
      "/clients",
      "/clients/:id",
      "/clients/:id/username",
      "/clients/:id/email",
      "/clients/:id/password",
      "/clients/:id/image",
      "/clients/:id/name",
      "/clients/:id/phone",
      "/clients/:id/target",
      "/measures",
    ],
  },
  guestsAllowedPaths: {
    type: [String],
    default: ["/auth", "/auth/login"],
  },
  passwordsMinLength: {
    type: Number,
    min: 4,
    max: 20,
    default: 6,
  },
  passwordsMaxLength: {
    type: Number,
    min: 4,
    max: 20,
    default: 10,
  },
});

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
