const settingsService = require("../services/settingsService");

exports.initializeSettings = () => async (req, res, next) => {
  const settings = await settingsService.getAll();
  req.settings = settings
    ? { ...settings, setupIsComplete: true }
    : { setupIsComplete: false };

  next();
};