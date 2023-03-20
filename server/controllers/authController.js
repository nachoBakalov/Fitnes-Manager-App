const router = require("express").Router();
const { json } = require("express");
const userService = require("../services/userService");
const { getErrorMessage } = require("../utils/errorUtils");

router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  console.log(req.body);
  try {
    const result = await userService.login(usernameOrEmail, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

// No session information is stored on the server.
// The API relies on JWT for sessions
// NO LOGOUT on server
// router.get("/logout", (req, res) => {
//   console.log("test");
//   res.send("logout page to come here");
// });

module.exports = router;