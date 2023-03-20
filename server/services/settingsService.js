const Settings = require("../models/Settings");

exports.getAll = async () => {
  return await Settings.findOne({}).lean();
};

exports.isComplete = async () => {
  const settings = await Settings.findOne({}).lean();

  return settings && settings.admin ? true : false;
};

exports.setAdmin = async (id) => {
  let settings = await Settings.findOne({});

  // Settings already exist in DB
  if (settings) {
    settings.admin = id;
    return await settings.save();
  }

  // Settings have not been created in the DB
  return (settings = await Settings.create({ admin: id }));
};

exports.updateAdmin = async (id) => {
  let settings = await Settings.findOne({});

  // Settings already exist in DB
  if (!settings) {
    throw new Error("Can't update admin before initial setup is completed.");
  }

  settings.admin = id;
  return await settings.save();
};

exports.getAllowedPaths = async (type) => {
  const settings = await this.getAll();

  if (type === "admin") {
    return ["*"];
  }
  
  if (type === "trainers") {
    return settings.trainersAllowedPaths;
  }

  if (type === "manager") {
    return settings.managersAllowedPaths;
  }

  return settings.clientsAllowedPaths;
};
