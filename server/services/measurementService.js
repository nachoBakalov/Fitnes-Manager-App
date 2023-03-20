const { db } = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const { removeEmptyAttributes } = require("../utils/jsUtils");

const User = require("../models/User");
const Card = require("../models/Card");
const Measures = require("../models/Measurement");
const settingsService = require("./settingsService");

const jwt = require("../libs/jsonwebtoken");
const { SECRET } = require("../constants");
const { dateToYYYYMMDDHHMINSEC, addMonths } = require("../utils/dateUtils");

exports.getMany = async (query) => {
  let qry = {};
  let result = { data: {}, count: 0 };

  result.count = await Card.find({}).countDocuments();

  qry.limit = query.limit ? query.limit : 20;
  result.limit = qry.limit;

  qry.skip = query.skip
    ? query.skip < result.count
      ? query.skip
      : result.count
    : 0;
  result.skip = qry.skip;

  qry.find = {};

  if (query.owner) {
    qry.find.owner = query.owner;
  }

  if (query.creator) {
    qry.find.creator = query.creator;
  }

  qry.active = query.active === false ? false : true;

  qry.orderBy = query.orderBy === "desc" ? "desc" : "asc";

  qry.sort = {};

  if (query.sortBy) {
    qry.sort[query.sortBy] = qry.orderBy;
  } else {
    qry.sort = { name: qry.orderBy };
  }

  result.data = await Card.find(qry.find)
    .sort(qry.sort)
    .skip(qry.skip)
    .limit(qry.limit)
    .lean();
  return result;
};

exports.getById = async (id) => {
  const card = await Card.findById(id).lean();

  if (!card) {
    throw new Error("Card does not exist.");
  }

  return card;
};

exports.create = async (data) => {
  const { type, start, end, trainingsLeft, paid, owner, trainer, creator } =
    data;

  const existingClient = await User.findById(owner);

  if (!existingClient) {
    throw new Error("Client does not exist");
  }

  const existingTrainer = await User.findById(trainer);

  if (!existingTrainer) {
    throw new Error("Trainer does not exist");
  }

  const existingCreator = await User.findById(creator);

  if (!existingCreator) {
    throw new Error("Creator does not exist");
  }

  if (
    !existingCreator.type ||
    (existingCreator.type !== "admin" &&
      existingCreator.type !== "manager" &&
      existingCreator.type !== "trainer")
  ) {
    throw new Error(`Unauthorised operation for ${existingCreator.type}`);
  }

  const newCard = removeEmptyAttributes(data);
  newCard.start = new Date(start);
  newCard.end = new Date(end);
  newCard.created = new Date();
  newCard.active = true;

  return await Card.create(newCard);
};

exports.delete = async (id) => {
  const card = await Card.findByIdAndDelete(id).lean();

  if (!card) {
    throw new Error("Card does not exist.");
  }

  return card;
};

exports.updateNotes = async (id, notes) => {
  const card = await Card.findById(id);

  if (!card) {
    throw new Error("Card does not exist");
  }

  if (card.notes === notes) {
    throw new Error("Nothing to update.");
  }

  card.notes = notes;
  card.modified = new Date();
  return await card.save();
};