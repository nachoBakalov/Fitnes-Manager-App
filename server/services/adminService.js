const bcrypt = require("bcrypt");
const Settings = require("../models/Settings");

const jwt = require("../libs/jsonwebtoken");
const { SECRET } = require("../constants");

exports.login = async (userNameOrEmail, password) => {
  const settings = await Settings.findOne().lean();

  if (!settings) {
    throw new Error("No installation found.");
  }

  if (!settings.adminEmail) {
    throw new Error("Problem authenticating user.");
  }

  const isValidPassword = await bcrypt.compare(
    password,
    settings.adminPassword
  );

  if (!isValidPassword) {
    throw new Error("Problem authenticating user.");
  }

  const token = createSession(existingUser);

  return token;
};

function createSession({ _id, email }) {
  const payload = {
    _id: _id,
    email: email,
    userType: admin,
    allowedPaths: ["*"],
  };

  const token = jwt.sign(payload, SECRET);

  return token;
}

exports.createAdmin = async (email, password) => {
  const existingAdmin = await User.findOne({ type: "admin" });

  if (existingAdmin) {
    throw new Error("Admin already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    userName: "Admin",
    email,
    password: hashedPassword,
    userType: "admin",
    created: new Date(),
  });
};