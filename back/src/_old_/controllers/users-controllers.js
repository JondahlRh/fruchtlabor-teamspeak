const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const createJwtToken = (id, permissions) => {
  return jwt.sign({ id, permissions }, process.env.JWT_SECRET);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const list = async (req, res, next) => {};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ungültige Eingaben!", 422));
  }

  const { username, email, password } = req.body;

  const userFindOneUsername = await User.findOne({ username });
  if (userFindOneUsername) {
    return next(
      new HttpError("Nutzer mit diesem Namen existiert bereits!", 422)
    );
  }

  const userFindOneEmail = await User.findOne({ email });
  if (userFindOneEmail) {
    return next(
      new HttpError("Nutzer mit dieser E-Mail existiert bereits!", 422)
    );
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  const token = createJwtToken(newUser.id, newUser.permissions);
  res.status(201).json({ id: newUser.id, token });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  const nameUser = await User.findOne({ username });
  if (!nameUser) {
    return next(new HttpError("Ungültige Anmeldedaten!", 403));
  }

  const isValidPassword = await bcrypt.compare(password, nameUser.password);
  if (!isValidPassword) {
    return next(new HttpError("Ungültige Anmeldedaten!", 403));
  }

  const token = createJwtToken(nameUser.id, nameUser.permissions);
  res.status(201).json({ id: nameUser.id, token });
};

const edit = async (req, res, next) => {
  const { id, username, email, password, roles } = req.body;

  const idUser = await User.findById(id);
  if (!idUser) {
    return next(new HttpError("Nutzer mit dieser Id existiert nicht!", 422));
  }

  if (!username && !email && !password && !roles) {
    return next(new HttpError("Keine Daten mitgeliefert!", 422));
  }

  if (username) idUser.username = username;
  if (email) idUser.email = email;
  if (password) idUser.password = await hashPassword(password);

  await idUser.save();

  res.json({ message: "Nutzer erfolgreich bearbeitet" });
};

module.exports = { list, edit, signup, login };
