require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const itemController = require("./controllers/ItemController");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
mongoose.set("useFindAndModify", false);

app.get("/api/v1", (req, res) => {
    res.status(200).json({
        success: true,
        message: "gifthub api reached",
    });
});

// ROUTES

//=== Item Route ====

// // show/get route
// app.get("api/v1/items/:id", itemController.getItem);

// create route
app.post("/api/v1/items", itemController.createItem);

// update route
app.patch("/api/v1/items/:id", itemController.updateItem);

// delete route
app.delete("/api/v1/items/:id", itemController.deleteItem);

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connection successful");

        app.listen(port, () => {
            console.log(`App listening on port: ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
