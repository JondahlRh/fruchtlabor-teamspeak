const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
const verifyJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  signJwtToken,
  verifyJwtToken,
  hashPassword,
  comparePassword,
};
