const { db } = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const { removeEmptyAttributes } = require("../utils/jsUtils");

const User = require("../models/User");
const Card = require("../models/Card");
const Measures = require("../models/Measurement");
const settingsService = require("../services/settingsService");

const jwt = require("../libs/jsonwebtoken");
const { SECRET } = require("../constants");
const { dateToYYYYMMDDHHMINSEC, addMonths } = require("../utils/dateUtils");

// User Service
// exports.findByUsername = (username) => User.findOne({username});

// exports.findByEmail = (email) => User.findOne({email});

// exports.getByUserId = (userId) => User.findById(userId).lean();

// exports.getAll = () => User.find({}).lean();

// exports.findMаny = (ids) => User.find({ _id: { $in: ids } }).lean();

exports.login = async (usernameOrEmail, password) => {
  const existingUser = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });

  if (!existingUser) {
    throw new Error("User does not exists.");
  }

  if (!existingUser.password) {
    throw new Error("Problem authenticating user.");
  }

  // User is set as inactive - should not be permitted to enter
  // TODO: If inactive users can be activated again a process, including sending confirmation email,
  // as well as permitting reactivation by a manager/admin/trainer should be developed
  if (!existingUser.active) {
    throw new Error("Problem authenticating user.");
  }

  if (existingUser.type === "admin" && !isEmail(usernameOrEmail)) {
    throw new Error("Admin must always sign in with email.");
  }

  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  if (!isValidPassword) {
    throw new Error("Problem authenticating user.");
  }
  const allowedPaths = await settingsService.getAllowedPaths(existingUser.type);

  const token = createSession(
    existingUser,
    allowedPaths,
    addMonths(new Date(), 1)
  );

  return token;
};

function createSession({ _id, email, username, type }, allowedPaths, expires) {
  const payload = {
    _id,
    email,
    username,
    type,
    allowedPaths,
    expires,
  };

  const token = jwt.sign(payload, SECRET);

  return token;
}

exports.getById = async (id) => {
  const user = await User.findById({ _id: id }).lean();

  if (!user) {
    throw new Error("User does not exist.");
  }

  return user;
};

exports.createAdmin = async (email, password) => {
  const existingAdmin = await User.findOne({ type: "admin", active: true });

  if (existingAdmin) {
    throw new Error("Admin already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    username: "Admin",
    email,
    password: hashedPassword,
    type: "admin",
    active: true,
    created: new Date(),
  });
};

exports.updateAdmin = async (email, password) => {
  const existingAdmin = await User.findOne({ type: "admin", active: true });
  let result = null;
  if (!existingAdmin) {
    throw new Error("Admin does not exist.");
  }

  if (existingAdmin.email === email) {
    throw new Error("User is already admin.");
  }

  // - deactivate old admin
  // TODO: this is a transaction - if the next steps do not complete correctly it should be reversed
  existingAdmin.username = `admin-before-${dateToYYYYMMDDHHMINSEC(new Date())}`;
  existingAdmin.active = false;
  existingAdmin.modified = new Date();
  await existingAdmin.save();

  const hashedPassword = await bcrypt.hash(password, 10);

  // check if user with that email already exists
  const userWithThatEmail = await User.findOne({ email: email });

  if (userWithThatEmail) {
    // only set user as the new admin and do not change their password
    userWithThatEmail.type = "admin";
    return await userWithThatEmail.save();
  }
  return await User.create({
    username: "Admin",
    email,
    password: hashedPassword,
    type: "admin",
    active: true,
    created: new Date(),
  });
};

exports.getMany = async (query) => {
  let qry = {};
  let result = { data: {}, count: 0 };

  qry.userType = query.type;
  result.count = await User.find({ type: qry.userType }).countDocuments();

  qry.limit = query.limit ? query.limit : 20;
  result.limit = qry.limit;

  qry.skip = query.skip
    ? query.skip < result.count
      ? query.skip
      : result.count
    : 0;
  result.skip = qry.skip;

  qry.find = {};
  qry.find.type = qry.userType;
  qry.find.active = query.active === false ? false : true;


  if (query.creator) {
    qry.find.creator = query.creator;
  }

  if (query.phone) {
    qry.phone = query.phone;
  }

  qry.orderBy = query.orderBy === "desc" ? "desc" : "asc";

  qry.sort = {};

  if (query.sortBy) {
    qry.sort[query.sortBy] = qry.orderBy;
  } else {
    qry.sort = { name: qry.orderBy };
  }

  result.data = await User.find(qry.find)
    .sort(qry.sort)
    .skip(qry.skip)
    .limit(qry.limit)
    .lean();
  return result;
};

exports.createUser = async (data) => {
  const { username, email, password } = data;

  let qry = {
    $or: [{ username }, { email }],
  };

  if (!username || username == "") {
    qry = { email };
  }

  if (!email || email == "") {
    qry = { username };
  }

  const existingUser = await User.findOne(qry);

  if (existingUser) {
    throw new Error("User alredy exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = removeEmptyAttributes(data);
  newUser.created = new Date();
  newUser.active = true;
  newUser.password = hashedPassword;

  return await User.create(newUser);
};

exports.delete = async (id) => {
  const user = await User.findByIdAndDelete(id).lean();

  if (!user) {
    throw new Error("User does not exist.");
  }

  return user;
};

exports.updateUsername = async (userId, username, type) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User does not exist.");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  if(username === user.username) {
    // Nothing to change
    throw new Error("New username equals old username.")
  }

  if ((!username || username=="") && (!user.email || user.email == "")) {
    throw new Error("Username or Email must be defined");
  }

  user.username = username;
  user.modified = new Date();
  return await user.save();
};

exports.updateEmail = async (userId, email, type) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User does not exist.");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  if(email === user.email) {
    // Nothing to change
    throw new Error("New email equals old email.")
  }

  if ((!email || email=="") && (!user.username || user.username == "")) {
    throw new Error("Username or Email must be defined");
  }

  user.email = email;
  user.modified = new Date();
  return await user.save();
};

exports.updatePassword = async (userId, password, type) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User does not exist.");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.modified = new Date();
  return await user.save();
};

exports.updateName = async (userId, name, type) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  user.name = name;
  user.modified = new Date();
  return await user.save();
};

exports.updateImage = async (userId, imageData, type) => {
  const user = User.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  // FS save image

  user.image = "new image url";
  user.modified = new Date();
  return user.save();
};

// TODO: If users should be able to transition from one role to another uncomment
// exports.updateType = async (userId, type) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new Error("User does not exist");
//   }

//   user.type = type;
//   user.modified = new Date();
//   return await user.save();
// };

exports.updatePhone = async (userId, phone, type) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  user.phone = phone.toString();
  user.modified = new Date();
  return await user.save();
};

exports.updateTarget = async (userId, target, type) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  user.target = target;
  user.modified = new Date();
  return await user.save();
};

exports.updateFoodRegime = async (userId, foodRegime, type) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  user.foodRegime = foodRegime;
  user.modified = new Date();
  return await user.save();
};

exports.updateNotes = async (userId, notes, type) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  user.notes = notes;
  user.modified = new Date();
  return await user.save();
};

exports.updateStatus = async (userId, active, type) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User does not exist");
  }

  if (user.type !== type) {
    throw new Error("Not allowed.");
  }

  user.active = active;
  user.modified = new Date();
  return await user.save();
};

//  --------------------------------------------------------------------

exports.addCard = async (data, userId, creatorId) => {
  const {
    type,
    start,
    end,
    trainingsLeft,
    paid,
    active,
    trainingsLog,
    owner,
    creator,
  } = data;

  const card = new Card({
    type,
    start,
    end,
    trainingsLeft,
    paid,
    active,
    trainingsLog,
    owner,
    creator,
    created: new Date(),
  });

  return await card.save();
};

exports.addMeasures = async (data, owner, creator) => {
  const {
    weight,
    neck,
    chest,
    waistAboveTheNavel,
    waistBelowNavel,
    hips,
    thigh,
  } = data;

  const measures = new Measures({
    weight,
    neck,
    chest,
    waistAboveTheNavel,
    waistBelowNavel,
    hips,
    thigh,
    owner,
    creator,
    created: new Date(),
  });

  return await measures.save();
};
