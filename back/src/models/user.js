const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  permissions: {
    type: [String],
    enum: ["users-get", "users-patch"],
    default: [],
  },
});

module.exports = model("User", userSchema);
