const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastMessage: {
    type: mongoose.Schema.ObjectId,
    ref: "Message",
  },
  item: {
    type: mongoose.Schema.ObjectId,
    ref: "Item",
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
