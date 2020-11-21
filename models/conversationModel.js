const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.ObjectId],
    ref: "User",
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  item: {
    type: mongoose.Schema.ObjectId,
    ref: "Item",
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
