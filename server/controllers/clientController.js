const router = require("express").Router();
const userService = require("../services/userService");
const cardService = require("../services/cardService");
const {
  DEFAULT_DB_FETCH_LIMIT,
  PASSWORD_VALIDATION_REGEXP,
  PASSWORD_VALIDATION_ALLOWED_CHARACTERS,
} = require("../constants");

const { json, query } = require("express");
const { getErrorMessage } = require("../utils/errorUtils");

router.get("/", async (req, res) => {
  const query = { ...req.query };
  query.type = "client";
  query.skip = query.skip ? query.skip : 0;
  query.limit = query.limit ? query.limit : DEFAULT_DB_FETCH_LIMIT;
  query.sortBy = query.sortBy ? query.sortBy : "name";
  query.orderBy = query.orderBy ? query.orderBy : "asc";

  try {
    const result = await userService.getMany(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await userService.getById(id);

    // Prevent exposing data of non clients
    if (result.type !== "client") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // do not send hash of password
    delete result.password;

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      image,
      name,
      phone,
      target,
      foodRegime,
      notes,
    } = req.body;
    const type = "client";

    if (!username && !email) {
      throw new Error("Username or Email must be defined");
    }

    if (!password) {
      throw new Error("Password must be defined");
    }

    const result = await userService.createUser({
      username,
      email,
      password,
      type,
      image,
      name,
      phone,
      target,
      foodRegime,
      notes,
      creator: req.user._id,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await userService.delete(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/username", async (req, res) => {
  try {
    const id = req.params.id;
    const { username } = req.body;

    if (!username) {
      throw new Error("Username must be defined.");
    }

    const result = await userService.updateUsername(id, username, "client");

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/email", async (req, res) => {
  try {
    const id = req.params.id;
    const { email } = req.body;

    if (!email) {
      throw new Error("Email must be defined.");
    }

    const result = await userService.updateEmail(id, email, "client");

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/password", async (req, res) => {
  try {
    const id = req.params.id;
    const { password } = req.body;

    if (!password) {
      throw new Error("Password must be defined.");
    }

    if (!PASSWORD_VALIDATION_REGEXP.test(password)) {
      throw new Error(
        `Password contains unallowed characters. Only the followind characters are allowed: ${PASSWORD_VALIDATION_ALLOWED_CHARACTERS}`
      );
    }

    if (
      req.settings.passwordsMinLength &&
      req.settings.passwordsMinLength > password.length
    ) {
      throw new Error(
        `Password is too short. Password must be minimum ${req.settings.passwordsMinLength} characters long.`
      );
    }

    if (
      req.settings.passwordsMaxLength &&
      req.settings.passwordsMaxLength < password.length
    ) {
      throw new Error(
        `Password is too long. Password must be maximum ${req.settings.passwordsMaxLength} characters long.`
      );
    }

    console.log(req.settings);

    const result = await userService.updatePassword(id, password, "client");

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/name", async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      throw new Error("Name must be defined.");
    }

    const result = await userService.updateName(id, name, "client");

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/phone", async (req, res) => {
  try {
    const id = req.params.id;
    const { phone } = req.body;

    if (!phone) {
      throw new Error("Phone must be defined.");
    }

    const result = await userService.updatePhone(id, phone, "client");

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/target", async (req, res) => {
  try {
    const id = req.params.id;
    const { target } = req.body;

    if (!target) {
      throw new Error("Target must be defined.");
    }

    const result = await userService.updateName(id, target, "client");

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/food-regime", async (req, res) => {
  try {
    const id = req.params.id;
    const { foodRegime } = req.body;

    if (!foodRegime) {
      throw new Error("Food regime must be defined.");
    }

    const result = await userService.updateFoodRegime(id, foodRegime, "client");

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/notes", async (req, res) => {
  try {
    const id = req.params.id;
    const { notes } = req.body;

    if (!notes) {
      throw new Error("Notes must be defined.");
    }

    const result = await userService.updateNotes(id, notes, "client");

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const id = req.params.id;
    const { active } = req.body;

    if (!active) {
      throw new Error("New status must be defined.");
    }

    const result = await userService.updateStatus(id, active, "client");

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

// Cards

router.get("/:id/cards", async (req, res) => {
  const query = { ...req.query };
  query.owner = req.params.id;

  query.skip = query.skip ? query.skip : 0;
  query.limit = query.limit ? query.limit : DEFAULT_DB_FETCH_LIMIT;
  query.sortBy = query.sortBy ? query.sortBy : "_id";
  query.orderBy = query.orderBy ? query.orderBy : "desc";

  try {
    const result = await cardService.getMany(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.get("/:id/cards/:cardId", async (req, res) => {
  const cardId = req.params.cardId;

  try {
    const result = await cardService.getById(cardId);

    if(result.owner.toString() !== req.user._id && req.user.type == "client") {
      // Client is trying to acces cardData of another client - NOT ALLOWED
      res.status(405).json({ error: "Not allowed" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

router.delete("/:id/cards/:cardId", async (req, res) => {
  const cardId = req.params.cardId;
  const owner = req.params.id;

  // TODO check if user is guest && owner - otherwise NOT ALLOWED
  try {
    const result = await cardService.delete(cardId);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

router.post("/:id/cards/", async (req, res) => {
  const owner = req.params.id;

  try {
    const { type, start, end, trainingsLeft, paid, trainer } = req.body;

    if (!type || type == "") {
      throw new Error("Card type must be defined");
    }

    if (!start) {
      throw new Error("Start date must be defined");
    }

    if (!end) {
      throw new Error("End date must be defined");
    }

    if (!trainingsLeft) {
      throw new Error("Trainings left date must be defined and bigger than 0");
    }

    if (!owner) {
      throw new Error("Card owner must be defined");
    }

    if (!trainingsLeft) {
      throw new Error("Trainer must be defined");
    }

    const result = await cardService.create({
      type,
      start,
      end,
      trainingsLeft,
      paid,
      owner,
      trainer,
      creator: req.user._id,
    });

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/cards/:cardId/type", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { type } = req.body;

    if (!type) {
      throw new Error("Type must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.updateType(cardId, type);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/cards/:cardId/start", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { start } = req.body;

    if (!start) {
      throw new Error("Start date must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.updateStart(cardId, start);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/cards/:cardId/end", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { end } = req.body;

    if (!end) {
      throw new Error("End date must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.updateEnd(cardId, end);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/cards/:cardId/trainings-left", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { trainingsLeft } = req.body;

    if (!trainingsLeft) {
      throw new Error("Trainings left must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.updateTrainingsLeft(cardId, trainingsLeft);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/cards/:cardId/trainer", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { trainer } = req.body;

    if (!trainer) {
      throw new Error("Trainer must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.updateTrainer(cardId, trainer);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/cards/:cardId/notes", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { notes } = req.body;

    if (!notes) {
      throw new Error("Notes must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.updateNotes(cardId, notes);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/cards/:cardId/paid", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { paid } = req.body;

    if (!paid) {
      throw new Error("Paid must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.updatePaid(cardId, paid);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/cards/:cardId/status", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { active } = req.body;

    if (!active) {
      throw new Error("New status must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.updateStatus(cardId, active);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.post("/:id/cards/:cardId/trainings", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const { trainer, date } = req.body;

    if (!trainer) {
      throw new Error("Trainer must be defined.");
    }

    if (!date) {
      throw new Error("Date must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.createTraining(cardId, trainer, date);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.delete("/:id/cards/:cardId/trainings/:trainingId", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const trainingId = req.params.trainingId;

    if (!trainingId) {
      throw new Error("Training id must be defined.");
    }
    // TODO check if user is guest && owner - otherwise NOT ALLOWED
    const result = await cardService.deleteTraining(cardId, trainingId);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

module.exports = router;
