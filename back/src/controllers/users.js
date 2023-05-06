const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const {
  hashPassword,
  signJwtToken,
  comparePassword,
} = require("../utility/auth");

const getUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
};

const patchUsers = async (req, res, next) => {
  const { id, username, email, password, permissions } = req.body;

  if (!username && !email && !password && !permissions) {
    return next(new HttpError("No data", 422));
  }

  const userById = await User.findById(id);
  if (!userById) {
    return next(new HttpError("Not Found", 404));
  }

  await User.findByIdAndUpdate(id, { username, email, password, permissions });

  res.status(201).json({ message: "Successfully edited" });
};

const postSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsArray = errors.array();
    return next(
      new HttpError(`Unprocessable Entity at ${errorsArray[0].path}`, 422)
    );
  }

  const { username, email, password } = req.body;

  const userByUsername = await User.findOne({ username });
  if (userByUsername) {
    return next(new HttpError("Conflict at username", 409));
  }

  const userByEmail = await User.findOne({ email });
  if (userByEmail) {
    return next(new HttpError("Conflict at username", 409));
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  const token = signJwtToken(newUser.id);
  res.status(201).json({ id: newUser.id, token });
};

const postLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const userByUsername = await User.findOne({ username });
  if (!userByUsername) {
    return next(new HttpError("Unauthorized", 401));
  }

  const isValidPassword = await comparePassword(
    password,
    userByUsername.password
  );
  if (!isValidPassword) {
    return next(new HttpError("Unauthorized", 401));
  }

  const token = signJwtToken(userByUsername.id, userByUsername.permissions);
  res.status(201).json({ id: userByUsername.id, token });
};

module.exports = { getUsers, patchUsers, postSignup, postLogin };
