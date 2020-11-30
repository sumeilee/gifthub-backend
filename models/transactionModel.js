const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    donorID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    requestorID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
        required: true,
    },
    date_delivered: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Fulfilled"],
        required: true,
        default: "Pending",
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

const TransactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = TransactionModel;
