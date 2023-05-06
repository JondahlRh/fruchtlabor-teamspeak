const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const checkAuth = (req, res, next, role) => {
  if (req.method === "OPTIONS") return next();

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return next(new HttpError("Authentifizierung fehlgeschlagen!", 401));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.id, roles: decodedToken.roles };

    if (role && !decodedToken.roles.includes(role)) {
      return next(new HttpError("Authentifizierung fehlgeschlagen!", 402));
    }
  } catch (error) {
    return next(new HttpError("Authentifizierung fehlgeschlagen!", 403));
  }
};

module.exports = checkAuth;
