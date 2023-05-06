const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const checkPermission = async (req, res, next, permission) => {
  if (req.method === "OPTIONS") return next();

  const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
  if (!token) return next(new HttpError("JWT token missing", 401));

  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  if (!decodedToken.permissions.includes(permission)) {
    return next(new HttpError("Not allowed", 403));
  }
};

module.exports = checkPermission;
