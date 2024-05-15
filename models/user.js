const { name } = require("ejs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama wajib diisi"],
  },
  email: {
    type: String,
    required: [true, "Email wajib diisi"],
  },
  nohp: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password wajib diisi"],
  },
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
