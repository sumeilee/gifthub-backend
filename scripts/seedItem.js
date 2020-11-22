require("dotenv").config();
const mongoose = require("mongoose");
const itemData = require("./seed/itemData");
const itemModel = require("../models/itemModel");

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((response) => {
        console.log("MongoDB connection successful");
    })
    .then((response) => {
        itemModel
            .insertMany(itemData)
            .then((insertResponse) => {
                console.log("Data seeding of items successful");
            })
            .catch((insertErr) => {
                console.log(insertErr);
            })
            .finally(() => {
                mongoose.disconnect();
            });
    })
    .catch((err) => {
        console.log(err);
    });
