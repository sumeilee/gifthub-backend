const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    // var name below TBC
    postType: {
        type: String,
        enum: ["request", "offer"],
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
        required: true,
    },
    images: [String],
    delivery: {
        type: String,
        enum: ["Included", "Not included"],
        required: true,
    },
    status: {
        type: String,
        enum: ["Open", "Pending Fulfilment", "Fulfilled"],
        required: true,
    },
    tags: [String],
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const ItemModel = mongoose.model("Item", itemSchema);

module.exports = ItemModel;
