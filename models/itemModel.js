const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  // var name below TBC
  postType: {
    type: String,
    enum: ["Request", "Offer"],
    required: true,
  },
  title: {
    type: String,
    required: true,
    max: 200,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Furniture",
      "Appliances",
      "Infant and Children",
      "Medical Aids",
      "Food",
    ], // add more later
    required: true,
  },
  images: [String],
  delivery: {
    type: String,
    enum: ["Included", "Not included"],
    default: "Included",
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Pending", "Fulfilled"],
    required: true,
    default: "Open",
  },
  tags: [String],
  postedBy: {
    //comment out for Postman test
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    // // for Postman test only
    // type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, // check time later
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now, // check time later
  },
  transaction: {
    type: mongoose.Schema.ObjectId,
    ref: "Transaction",
  },
});

const ItemModel = mongoose.model("Item", itemSchema);

module.exports = ItemModel;
