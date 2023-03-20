const router = require("express").Router();
const { json } = require("express");
const userService = require("../services/userService");
const { getErrorMessage } = require("../utils/errorUtils");

router.post("/add/admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userService.createAdmin(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

router.post("/add/manager", async (req, res) => {
  if(!req.user) {
    res.status(401).json({ error: "Not allowed." });
  }

  // const { email, password } = req.body;

  // try {
  //   const result = await userService.create(email, password);
  //   res.status(200).json(result);
  // } catch (error) {
  //   res.status(400).json({ error: getErrorMessage(error) });
  // }
});

module.exports = router;
