const mongoose = require("mongoose");

const userSocketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  socket: {
    type: String,
    required: true,
  },
});

const UserSocket = mongoose.model("UserSocket", userSocketSchema);

module.exports = UserSocket;
