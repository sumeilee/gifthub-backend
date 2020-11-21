const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: "Conversation",
    required: true,
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  attachments: [String],
  viewed: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
