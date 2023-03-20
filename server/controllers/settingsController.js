const router = require("express").Router();
const { json } = require("express");
const userService = require("../services/userService");
const settingsService = require("../services/settingsService");
const { getErrorMessage } = require("../utils/errorUtils");

router.get("/setup-status", async (req, res) => {
  try {
    const isComplete = await settingsService.isComplete();
    res.status(200).json({ isComplete });
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.post("/admin", async (req, res) => {
  try {
    const isComplete = await settingsService.isComplete();
    if (isComplete) {
      throw new Error("Setup is complete.");
    }

    const { email, password } = req.body;

    if (!email) {
      throw new Error("Email must be defined");
    }

    if (!password) {
      throw new Error("Password must be defined");
    }

    const result = await userService.createAdmin(email, password);

    await settingsService.setAdmin(result._id);

    // TODO and save it in the settings
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.put("/admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Email must be defined");
    }

    // if new admin email is already
    // if (!password) {
    //   throw new Error("Password must be defined");
    // }

    const result = await userService.updateAdmin(email, password);

    await settingsService.updateAdmin(result._id);

    // TODO and save it in the settings
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

module.exports = router;
