const router = require("express").Router();
const { json, query } = require("express");

const measurementController = require("../services/measurementService");
const {
  DEFAULT_DB_FETCH_LIMIT,
  PASSWORD_VALIDATION_REGEXP,
  PASSWORD_VALIDATION_ALLOWED_CHARACTERS,
} = require("../constants");
const { getErrorMessage } = require("../utils/errorUtils");

router.get("/", async (req, res) => {
  const query = { ...req.query };

  query.skip = query.skip ? query.skip : 0;
  query.limit = query.limit ? query.limit : DEFAULT_DB_FETCH_LIMIT;
  query.sortBy = query.sortBy ? query.sortBy : "_id";
  query.orderBy = query.orderBy ? query.orderBy : "desc";

  try {
    const result = await measurementController.getMany(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await measurementController.getById(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await measurementController.delete(id);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: getErrorMessage(error) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { type, start, end, trainingsLeft, paid, owner, trainer } = req.body;

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

    const result = await measurementController.create({
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

router.put("/:id/notes", async (req, res) => {
  try {
    const id = req.params.id;
    const { notes } = req.body;

    if (!notes) {
      throw new Error("Notes must be defined.");
    }

    const result = await measurementController.updateNotes(id, notes);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

module.exports = router;