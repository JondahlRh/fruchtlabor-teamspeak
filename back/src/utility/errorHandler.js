const HttpError = require("../models/http-error");

const asyncHandler = (func) => (req, res, next) =>
  func(req, res, next).catch(() => next(new HttpError()));

module.exports = asyncHandler;
