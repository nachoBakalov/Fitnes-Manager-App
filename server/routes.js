const router = require("express").Router();

const measurementController = require("./controllers/measurementController");
const clientController = require("./controllers/clientController");
const managerController = require("./controllers/managerController");
const trainerController = require("./controllers/trainerController");
const settingsController = require("./controllers/settingsController");
const authController = require("./controllers/authController");

router.use("/settings", settingsController);
router.use("/auth", authController);
router.use("/managers", managerController);
router.use("/trainers", trainerController);
router.use("/clients", clientController);
router.use('/measurements', measurementController);

// custom 404
router.use("/404", (req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// TODO: Security - Uncomment following lines in production
// custom error handler
// router.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// });

module.exports = router;
