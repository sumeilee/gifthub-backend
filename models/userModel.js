const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    max: 100,
  },
  last_name: {
    type: String,
    required: true,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 100,
  },
  pwsalt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },

  userType: {
    type: String,
    enum: ["requestor", "donor", "both"],
    required: true,
  },

  organisation: {
    type: String,
  },

  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
