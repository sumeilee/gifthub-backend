require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://gifthub.herokuapp.com"
        : "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;

const userController = require("./controllers/userController");
const itemController = require("./controllers/ItemController");
const transactionController = require("./controllers/TransactionController");
const conversationController = require("./controllers/conversationController");
const messageController = require("./controllers/messageController");

const messageModel = require("./models/messageModel");

const {
  getUserSocket,
  createUserSocket,
  deleteUserSocket,
} = require("./services/sockets");

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
app.get("/api/v1/users/me", userController.userProfile); // get user profile
app.get("/api/v1/users/items", userController.userItems); // get user items
app.patch("/api/v1/users/me", userController.updateUser); // update route

// MESSAGE ROUTES
app.get("/api/v1/conversations/:id", conversationController.getConversation);
app.get("/api/v1/conversations", conversationController.getConversations);
app.post("/api/v1/conversations", conversationController.createConversation);

app.get("/api/v1/messages", messageController.getMessages);
app.post("/api/v1/messages", messageController.createMessage);
app.get("/api/v1/messages/:id", messageController.getMessage);
app.patch("/api/v1/messages/:id", messageController.updateMessage);
app.delete("/api/v1/messages/:id", messageController.deleteMessage);

io.on("connection", (socket) => {
  console.log(`new socket connection: ${socket.id}`);

  socket.on("disconnect", async () => {
    const response = await deleteUserSocket(socket.id);
    if (response.n > 0) {
      console.log(`userSocket for ${socket.id} deleted`);
    } else {
      console.log(`userSocket for ${socket.id} not found`);
    }
  });

  socket.on("login", async (user) => {
    try {
      const userSocket = await createUserSocket(user, socket.id);
      if (userSocket) {
        console.log(userSocket);
      } else {
        console.log("user socket not created");
      }
    } catch (err) {
      console.log(err.message);
    }
  });
});

try {
  messageModel.watch().on("change", async (data) => {
    const message = data.fullDocument;
    const recipient = message.recipient;

    try {
      const userSocket = await getUserSocket(recipient);
      console.log(`emitting message to ${userSocket.socket}`);
      io.to(userSocket.socket).emit("message", message);
    } catch (err) {
      console.log(err.message);
    }
  });
} catch (err) {
  console.log(err);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connection successful");
    server.listen(port, () => {
      console.log(`App listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
