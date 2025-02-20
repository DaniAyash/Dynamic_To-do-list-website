const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const collection = mongoose.model("users", UserSchema);

module.exports = collection;
