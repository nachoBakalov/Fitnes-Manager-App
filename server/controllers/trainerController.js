const router = require("express").Router();
const userService = require("../services/userService");
const {
  DEFAULT_DB_FETCH_LIMIT,
  PASSWORD_VALIDATION_REGEXP,
  PASSWORD_VALIDATION_ALLOWED_CHARACTERS,
} = require("../constants");

const { json, query } = require("express");
const { getErrorMessage } = require("../utils/errorUtils");

router.get("/", async (req, res) => {
  const query = { ...req.query };
  query.type = "trainer";
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

    // Prevent exposing data of non trainers
    if (result.type !== "trainer") {
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
    const type = "trainer";

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

// TODO: add authorisation check for delete/put/create
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

    const result = await userService.updateUsername(id, username, "trainer");

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

    const result = await userService.updateEmail(id, email, "trainer");

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

    if (req.settings.passwordsMinLength && req.settings.passwordsMinLength > password.length) {
      throw new Error (`Password is too short. Password must be minimum ${req.settings.passwordsMinLength} characters long.`)
    }

    if (req.settings.passwordsMaxLength && req.settings.passwordsMaxLength < password.length) {
      throw new Error (`Password is too long. Password must be maximum ${req.settings.passwordsMaxLength} characters long.`)
    }

    console.log(req.settings);

    const result = await userService.updatePassword(id, password, 'trainer');

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

    const result = await userService.updateName(id, name, "trainer");

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

    const result = await userService.updatePhone(id, phone, "trainer");

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

    const result = await userService.updateName(id, target, "trainer");

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

    const result = await userService.updateFoodRegime(id, foodRegime, "trainer");

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

    const result = await userService.updateNotes(id, notes, "trainer");

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

    const result = await userService.updateStatus(id, active, "trainer");

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: getErrorMessage(error) });
  }
});

module.exports = router;