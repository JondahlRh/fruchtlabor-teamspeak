const HttpError = require("../models/http-error");
const User = require("../models/user");
const { verifyJwtToken } = require("../utility/auth");

const checkPermission = (permission) => async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  let token;
  try {
    token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) throw "Unauthorized";
  } catch (error) {
    return next(new HttpError("Unauthorized", 401));
  }

  try {
    const decodedToken = verifyJwtToken(token);
    const userById = await User.findById(decodedToken.id);
    if (!userById.permissions.includes(permission)) {
      return next(new HttpError("Not allowed", 403));
    }
  } catch (error) {
    return next(new HttpError());
  }

  next();
};

module.exports = checkPermission;
