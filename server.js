require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;

const userController = require("./controllers/userController");
const userModel = require("./models/userModel");
const itemController = require("./controllers/ItemController");
const transactionController = require("./controllers/TransactionController");
const conversationController = require("./controllers/conversationController");
const messageController = require("./controllers/messageController");

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

// ITEM ROUTES
app.get("/api/v1/offers", itemController.listOffers);
app.get("/api/v1/requests", itemController.listRequests);
app.get("/api/v1/items/:id", itemController.getItem);
app.post("/api/v1/items", itemController.createItem);
app.patch("/api/v1/items/:id", itemController.updateItem);
app.delete("/api/v1/items/:id", itemController.deleteItem);

// TRANSACTION ROUTES
app.get("/api/v1/transactions/:id", transactionController.getTransaction);
app.post("/api/v1/transactions", transactionController.createTransaction);

// USER ROUTES
app.post("/api/v1/user/register", userController.registerUser); // registration post
app.post("/api/v1/user/login", userController.userLogin); // login post
// app.post("/api/v1/user/login", userController.userLogout); // logout post
app.get("/api/v1/users/me", userController.userProfile); // get user profile
app.get("/api/v1/users/items", userController.userItems); // get user items
app.patch("/api/v1/users/me", userController.updateUser); // update route

// MESSAGE ROUTES
app.get(
  "/api/v1/conversations/:id",
  verifyToken,
  conversationController.getConversation
);
app.get(
  "/api/v1/conversations",
  verifyToken,
  conversationController.getConversations
);
app.post(
  "/api/v1/conversations",
  verifyToken,
  conversationController.createConversation
);

app.get("/api/v1/messages", verifyToken, messageController.getMessages);
app.post("/api/v1/messages", verifyToken, messageController.createMessage);
app.get("/api/v1/messages/:id", verifyToken, messageController.getMessage);
app.patch("/api/v1/messages/:id", verifyToken, messageController.updateMessage);
app.delete(
  "/api/v1/messages/:id",
  verifyToken,
  messageController.deleteMessage
);

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

const verifyToken = (req, res, next) => {
  const authToken = req.headers.auth_token;

  if (!authToken) {
    res.status(500).json({
      success: false,
      message: "Auth header value is missing",
    });
    return;
  }

  try {
    jwt.verify(authToken, process.env.JWT_SECRET, {
      algorithms: ["HS384"],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Auth token is invalid",
    });
    return;
  }

  next();
};
